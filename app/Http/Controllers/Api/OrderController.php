<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Services\XenditService;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the customer's orders.
     */
    public function index(Request $request, XenditService $xenditService)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with(['items.product', 'payment'])
            ->latest()
            ->get();

        // Proactive Sync: Sync pending payments before returning
        $hasUpdate = false;
        foreach ($orders as $order) {
            if ($order->payment_status === 'pending' && $order->payment) {
                $updatedPayment = $xenditService->syncPayment($order->payment);
                if ($updatedPayment->status === 'paid') {
                    $hasUpdate = true;
                }
            }
        }

        // If any payment was updated to paid, re-fetch orders to get fresh statuses
        if ($hasUpdate) {
            $orders = Order::where('user_id', $request->user()->id)
                ->with(['items.product', 'payment'])
                ->latest()
                ->get();
        }

        // Get all reviews by this user to map them manually
        $reviews = Review::where('user_id', $request->user()->id)->get();

        // Map reviews to items
        $orders->each(function($order) use ($reviews) {
            $order->items->each(function($item) use ($order, $reviews) {
                $item->review = $reviews->where('order_id', $order->id)
                                       ->where('product_id', $item->product_id)
                                       ->first();
            });
        });

        return response()->json([
            'status' => 'success',
            'data' => $orders,
        ]);
    }

    /**
     * Handle the customer checkout process.
     */
    public function store(Request $request, XenditService $xenditService)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'recipient_name' => 'required|string',
            'phone_number' => 'required|string',
            'shipping_address' => 'required|string',
            'city_district' => 'required|string',
            'postal_code' => 'required|string',
            'courier_name' => 'required|string',
            'shipping_service' => 'required|string',
            'shipping_cost' => 'required|numeric',
            'estimated_arrival' => 'nullable|string',
            'courier_notes' => 'nullable|string',
            'payment_method_name' => 'nullable|string',
            'return_url' => 'nullable|string',
        ]);

        // Duplicate prevention: Check for a pending order with exact same address, user, and amount in the last 2 minutes
        $existingOrder = Order::where('user_id', $request->user()->id)
            ->where('shipping_address', $request->shipping_address)
            ->where('recipient_name', $request->recipient_name)
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
            $itemsSubtotal = 0;
            $orderItemsData = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $price = $product->price;
                $subtotal = $price * $item['quantity'];
                $itemsSubtotal += $subtotal;

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                ];
            }

            $tax = $itemsSubtotal * 0.1;
            $totalAmount = $itemsSubtotal + $tax + $request->shipping_cost;

            $order = Order::create([
                'user_id' => $request->user()->id,
                'recipient_name' => $request->recipient_name,
                'phone_number' => $request->phone_number,
                'shipping_address' => $request->shipping_address,
                'city_district' => $request->city_district,
                'postal_code' => $request->postal_code,
                'courier_notes' => $request->courier_notes,
                'courier_name' => $request->courier_name,
                'shipping_service' => $request->shipping_service,
                'estimated_arrival' => $request->estimated_arrival,
                'shipping_cost' => $request->shipping_cost,
                'payment_method_name' => $request->payment_method_name,
                'total_amount' => round($totalAmount),
                'status' => 'pending',
                'order_date' => now(),
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

            $payment = $xenditService->createInvoice($order, $request->return_url);

            return response()->json([
                'status' => 'success',
                'message' => 'Order created successfully',
                'data' => [
                    'order' => $order->load(['items.product', 'payment']),
                    'checkout_url' => $payment->checkout_url,
                ],
            ], 201);
        });
    }

    /**
     * Mark order as completed by user.
     */
    public function complete($id)
    {
        $order = Order::where('user_id', Auth::id())->findOrFail($id);

        if ($order->payment_status !== 'paid') {
            return response()->json([
                'status' => 'error',
                'message' => 'Pesanan belum dibayar.',
            ], 400);
        }

        if (! in_array($order->status, ['processing', 'shipped'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pesanan tidak bisa diselesaikan pada status saat ini.',
            ], 400);
        }

        $order->update(['status' => 'completed']);

        return response()->json([
            'status' => 'success',
            'message' => 'Pesanan telah selesai. Silakan berikan ulasan produk!',
            'data' => $order,
        ]);
    }
}
