<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\XenditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Handle the customer checkout process.
     */
    public function store(Request $request, XenditService $xenditService)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
        ]);

        // Duplicate prevention: Check for a pending order with exact same address and user in the last 2 minutes
        $existingOrder = Order::where('user_id', $request->user()->id)
            ->where('shipping_address', $request->shipping_address)
            ->where('status', 'pending')
            ->where('created_at', '>=', now()->subMinutes(2))
            ->first();

        if ($existingOrder) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda sudah membuat pesanan serupa. Silakan selesaikan pembayaran atau tunggu beberapa saat.',
            ], 422);
        }

        return DB::transaction(function () use ($request, $xenditService) {
            $totalAmount = 0;
            $orderItemsData = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $price = $product->price;
                $subtotal = $price * $item['quantity'];
                $totalAmount += $subtotal;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                ];
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_amount' => round($totalAmount),
                'status' => 'pending',
                'order_date' => now(),
                'shipping_address' => $request->shipping_address,
                'payment_status' => 'pending',
            ]);

            if ($order->total_amount <= 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Total amount must be greater than 0. Please check your product prices.',
                ], 422);
            }

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            // Load user relation for XenditService customer data
            $order->load('user');

            $payment = $xenditService->createInvoice($order);

            return response()->json([
                'status' => 'success',
                'message' => 'Order created successfully',
                'data' => [
                    'order' => $order->load('items.product'),
                    'checkout_url' => $payment->checkout_url,
                ],
            ], 201);
        });
    }
}
