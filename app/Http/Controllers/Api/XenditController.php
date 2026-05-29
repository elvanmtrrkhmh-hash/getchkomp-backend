<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\XenditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class XenditController extends Controller
{
    protected XenditService $xenditService;

    public function __construct(XenditService $xenditService)
    {
        $this->xenditService = $xenditService;
    }

    /**
     * Handle the Xendit webhook callback.
     */
    public function webhook(Request $request)
    {
        Log::info('Xendit Webhook Received:', $request->all());
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

        if (! $externalId) {
            Log::error('Xendit Webhook: Missing external_id', $payload);

            return response()->json([
                'status' => 'error',
                'message' => 'Missing external_id',
            ], 400);
        }

        $payment = Payment::with('order')->where('external_id', $externalId)->first();

        if (! $payment) {
            Log::error('Xendit Webhook: Payment not found', ['external_id' => $externalId]);

            return response()->json([
                'status' => 'error',
                'message' => 'Payment not found',
            ], 404);
        }

        // Pass the webhook payload directly for immediate update
        $this->xenditService->syncPayment($payment, $payload);

        return response()->json([
            'status' => 'success',
            'message' => 'Webhook processed successfully',
        ]);
    }

    /**
     * Sync payment status from Xendit (Fallback for when webhook fails)
     */
    public function syncPayment(string $externalId)
    {
        $payment = Payment::with('order')->where('external_id', $externalId)->first();

        if (! $payment) {
            return response()->json(['message' => 'Payment not found'], 404);
        }

        try {
            $this->xenditService->syncPayment($payment);

            return response()->json([
                'message' => 'Payment synced successfully',
                'data' => $payment->load('order'),
            ]);
        } catch (\Exception $e) {
            Log::error('Manual Sync Failed:', ['error' => $e->getMessage()]);

            return response()->json(['message' => 'Sync failed: '.$e->getMessage()], 500);
        }
    }
}
