<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class XenditController extends Controller
{
    /**
     * Handle the Xendit webhook callback.
     */
    public function webhook(Request $request)
    {
        $callbackToken = $request->header('x-callback-token');

        if ($callbackToken !== config('services.xendit.callback_token')) {
            Log::warning('Unauthorized Xendit Webhook attempt.', [
                'token' => $callbackToken,
                'payload' => $request->all(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Invalid callback token',
            ], 403);
        }

        $payload = $request->all();
        $externalId = $payload['external_id'] ?? null;
        $status = $payload['status'] ?? null;

        if (!$externalId) {
            Log::error('Xendit Webhook: Missing external_id', $payload);
            return response()->json([
                'status' => 'error',
                'message' => 'Missing external_id',
            ], 400);
        }

        $payment = Payment::with('order')->where('external_id', $externalId)->first();

        if (!$payment) {
            Log::error('Xendit Webhook: Payment not found', ['external_id' => $externalId]);
            return response()->json([
                'status' => 'error',
                'message' => 'Payment not found',
            ], 404);
        }

        // Avoid repeated processing for PAID status
        if ($payment->status === Payment::STATUS_PAID) {
            Log::info('Xendit Webhook: Payment already processed', ['external_id' => $externalId]);
            return response()->json([
                'status' => 'success',
                'message' => 'Payment already processed',
            ]);
        }

        $payment->status = $status;
        $payment->payment_channel = $payload['payment_channel'] ?? $payment->payment_channel;
        $payment->payment_method = $payload['payment_method'] ?? $payment->payment_method;
        $payment->payment_status = strtolower($status);
        $payment->metadata = array_merge($payment->metadata ?? [], $payload);
        $payment->save();

        if ($status === 'PAID') {
            $payment->order->update([
                'payment_status' => 'paid',
                'status' => 'completed',
            ]);
            Log::info('Xendit Webhook: Order marked as PAID', ['order_id' => $payment->order_id]);
        } elseif ($status === 'EXPIRED') {
            $payment->order->update([
                'payment_status' => 'expired',
                'status' => 'canceled',
            ]);
            Log::info('Xendit Webhook: Order marked as EXPIRED', ['order_id' => $payment->order_id]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Webhook processed successfully',
        ]);
    }
}
