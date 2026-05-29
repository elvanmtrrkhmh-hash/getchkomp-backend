<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Xendit\Configuration;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;
use Xendit\XenditSdkException;

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
    public function createInvoice($order, $returnUrl = null)
    {
        // Try to get frontend URL from returnUrl, referer, or env
        $fallbackUrl = env('FRONTEND_URL');
        if (! $fallbackUrl && request()->headers->has('referer')) {
            $referer = request()->headers->get('referer');
            $urlParts = parse_url($referer);
            $fallbackUrl = $urlParts['scheme'].'://'.$urlParts['host'].(isset($urlParts['port']) ? ':'.$urlParts['port'] : '');
        }
        $fallbackUrl = $fallbackUrl ?: config('app.url');

        $successUrl = $returnUrl ?: ($fallbackUrl.'/orders');
        $failureUrl = $returnUrl ?: ($fallbackUrl.'/orders');

        $params = new CreateInvoiceRequest([
            'external_id' => (string) $order->order_number,
            'amount' => (int) $order->total_amount,
            'description' => 'Payment for Order #'.$order->order_number,
            'customer' => [
                'given_names' => $order->user->name ?? 'Customer',
                'email' => $order->user->email ?? '',
            ],
            'success_redirect_url' => $successUrl,
            'failure_redirect_url' => $failureUrl,
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

            throw new \Exception('Xendit Error: '.$e->getMessage());
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
            throw new \Exception('Xendit Error: '.$e->getMessage());
        }
    }

    /**
     * Sync payment status from Xendit and update local records.
     */
    public function syncPayment(Payment $payment, array $payload = [])
    {
        // Avoid repeated processing if already successful
        if ($payment->payment_status === 'success' && $payment->status === 'paid') {
            return $payment;
        }

        try {
            // If no payload provided (manual sync), fetch from API
            if (empty($payload)) {
                $invoiceId = $payment->metadata['invoice_id'] ?? null;
                if (! $invoiceId) {
                    Log::warning('Xendit Sync: Missing invoice_id in metadata', ['payment_id' => $payment->id]);

                    return $payment;
                }

                $invoice = $this->getInvoice($invoiceId);

                // Extract data from SDK object safely - Avoid getPaymentChannel()
                $payload = [
                    'status' => method_exists($invoice, 'getStatus') ? $invoice->getStatus() : ($payment->status ?? 'PENDING'),
                    'payment_method' => method_exists($invoice, 'getPaymentMethod') ? $invoice->getPaymentMethod() : null,
                    'paid_at' => method_exists($invoice, 'getPaidAt') ? $invoice->getPaidAt() : null,
                    'paid_amount' => method_exists($invoice, 'getPaidAmount') ? $invoice->getPaidAmount() : null,
                ];

                // Fallback: Use JSON conversion to get raw data safely without calling non-existent methods
                try {
                    $jsonArray = json_decode(json_encode($invoice), true);
                    if (is_array($jsonArray)) {
                        $payload = array_merge($jsonArray, array_filter($payload));
                    }
                } catch (\Exception $e) {
                    Log::warning('Xendit Sync: JSON conversion failed', ['error' => $e->getMessage()]);
                }
            }

            Log::info('Xendit Processing Payload:', [
                'external_id' => $payment->external_id,
                'status' => $payload['status'] ?? 'unknown',
                'method' => $payload['payment_method'] ?? 'unknown',
            ]);

            $status = strtoupper($payload['status'] ?? 'PENDING');

            // Normalize status to application-specific values
            $normalizedStatus = 'pending';
            if ($status === 'PAID' || $status === 'SETTLED') {
                $normalizedStatus = 'paid';
            } elseif ($status === 'EXPIRED') {
                $normalizedStatus = 'expired';
            } elseif ($status === 'FAILED') {
                $normalizedStatus = 'failed';
            } elseif ($status === 'CANCELED' || $status === 'CANCELLED') {
                $normalizedStatus = 'canceled';
            }

            // Update Payment record with normalized status
            $payment->status = $normalizedStatus;
            $payment->payment_status = $normalizedStatus;

            // Map Channel/Bank - Extract safely from payload
            $payment->payment_channel = $payload['payment_channel'] ??
                                      $payload['bank_code'] ??
                                      $payload['retail_outlet_name'] ??
                                      $payload['ewallet_type'] ??
                                      $payload['payment_destination'] ??
                                      $payment->payment_channel;

            // Map Method/Category as requested by user
            $rawMethod = strtoupper($payload['payment_method'] ?? $payload['payment_type'] ?? '');
            if (str_contains($rawMethod, 'EWALLET')) {
                $payment->payment_method = 'E-Wallet';
            } elseif (str_contains($rawMethod, 'QR_CODE') || str_contains($rawMethod, 'QRIS')) {
                $payment->payment_method = 'QRIS';
            } elseif (str_contains($rawMethod, 'VIRTUAL_ACCOUNT') || str_contains($rawMethod, 'BANK_TRANSFER')) {
                $payment->payment_method = 'Transfer Bank';
            } elseif (str_contains($rawMethod, 'CARD')) {
                $payment->payment_method = 'Kartu Kredit/Debit';
            } elseif (str_contains($rawMethod, 'DIRECT_DEBIT')) {
                $payment->payment_method = 'Direct Debit';
            } else {
                $payment->payment_method = $payload['payment_method'] ?? $payload['payment_type'] ?? $payment->payment_method;
            }

            // QRIS specific detection fallback
            if (empty($payment->payment_method) && str_contains(strtoupper($payment->payment_channel ?? ''), 'QR')) {
                $payment->payment_method = 'QRIS';
            }

            $payment->payment_status = ($status === 'PAID' || $status === 'SETTLED') ? 'success' : strtolower($status);

            // Capture payment date
            $paidAt = $payload['paid_at'] ?? null;
            if ($paidAt) {
                $payment->payment_date = $paidAt;
            } elseif ($status === 'PAID' || $status === 'SETTLED') {
                $payment->payment_date = now();
            }

            // Update metadata with the latest info
            $payment->metadata = array_merge($payment->metadata ?? [], $payload, [
                'last_sync_at' => now()->toDateTimeString(),
            ]);
            $payment->save();

            // Update Order record
            if ($status === 'PAID' || $status === 'SETTLED') {
                $order = $payment->order;
                if ($order && $order->payment_status !== 'paid') {
                    $order->update([
                        'payment_status' => 'paid',
                        'status' => 'processing',
                    ]);
                    Log::info('Xendit Sync: Order updated to PAID', ['order_id' => $order->id]);
                }
            } elseif ($status === 'EXPIRED') {
                $order = $payment->order;
                if ($order && $order->payment_status !== 'expired') {
                    $order->update([
                        'payment_status' => 'expired',
                        'status' => 'cancelled',
                    ]);
                }
            }

            return $payment;
        } catch (\Exception $e) {
            Log::error('Xendit Sync Error:', ['payment_id' => $payment->id, 'error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);

            return $payment;
        }
    }
}
