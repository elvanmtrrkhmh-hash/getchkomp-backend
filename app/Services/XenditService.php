<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\XenditSdkException;
use Illuminate\Support\Facades\Log;

class XenditService
{
    protected InvoiceApi $invoiceApi;

    public function __construct()
    {
        $config = Configuration::getDefaultConfiguration()->setApiKey(config('services.xendit.secret_key'));
        $this->invoiceApi = new InvoiceApi(null, $config);
    }



    /**
     * Create a Xendit Invoice for an Order.
     */
    public function createInvoice(Order $order): Payment
    {
        $params = new CreateInvoiceRequest([
            'external_id' => (string) $order->order_number,
            'amount' => (int) $order->total_amount,
            'description' => 'Payment for Order #' . $order->order_number,
            'customer' => [
                'given_names' => $order->user->name ?? 'Customer',
                'email' => $order->user->email ?? '',
            ],
            'success_redirect_url' => config('app.url') . '/orders/' . $order->id,
            'failure_redirect_url' => config('app.url') . '/orders/' . $order->id,
            'currency' => 'IDR',
        ]);

        try {
            $response = $this->invoiceApi->createInvoice($params);

            Log::info('Xendit Invoice Created:', [
                'external_id' => $order->order_number,
                'invoice_id' => $response->getId(),
            ]);

            return Payment::updateOrCreate(
                ['external_id' => $order->order_number],
                [
                    'order_id' => $order->id,
                    'user_id' => $order->user_id, // Added user_id for better tracking
                    'amount' => $order->total_amount,
                    'status' => Payment::STATUS_PENDING,
                    'checkout_url' => $response->getInvoiceUrl(),
                    'metadata' => array_merge((array) $response, [
                        'invoice_id' => $response->getId(),
                        'created_at' => now()->toDateTimeString(),
                    ]),
                ]
            );
        } catch (XenditSdkException $e) {
            Log::error('Xendit Request Error:', [
                'params' => $params,
                'message' => $e->getMessage(),
                'full_error' => $e->getFullError(),
            ]);

            throw new \Exception('Xendit Error: ' . $e->getMessage());
        }
    }

    /**
     * Get Invoice details from Xendit.
     */
    public function getInvoice(string $invoiceId)
    {
        try {
            return $this->invoiceApi->getInvoiceById($invoiceId);
        } catch (XenditSdkException $e) {
            throw new \Exception('Xendit Error: ' . $e->getMessage());
        }
    }
}
