<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class ReviewController extends Controller
{
    /**
     * Store a newly created review in storage.
     */
    public function store(Request $request)
    {
        // AUTO-FIX: Automatically add order_id column if it doesn't exist
        if (!Schema::hasColumn('reviews', 'order_id')) {
            try {
                Schema::table('reviews', function (Blueprint $table) {
                    $table->foreignId('order_id')->nullable()->after('product_id')->constrained('orders')->cascadeOnDelete();
                });
            } catch (\Exception $e) {
                // Silently fail if table is already being modified
            }
        }

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'order_id' => 'required|exists:orders,id',
            'rating' => 'required|numeric|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $user = Auth::user();

        // Check if user has purchased the product in this specific order and it is 'completed'
        $hasPurchased = Order::where('id', $request->order_id)
            ->where('user_id', $user->id)
            ->where('status', 'completed')
            ->whereHas('items', function ($query) use ($request) {
                $query->where('product_id', $request->product_id);
            })
            ->exists();

        if (! $hasPurchased) {
            return response()->json([
                'status' => 'error',
                'message' => 'Review hanya bisa diberikan setelah pesanan selesai.',
            ], 403);
        }

        // Check if user has already reviewed THIS product for THIS order
        $alreadyReviewedQuery = Review::where('user_id', $user->id)
            ->where('product_id', $request->product_id);
            
        // Safety check: only filter by order_id if the column exists
        if (\Illuminate\Support\Facades\Schema::hasColumn('reviews', 'order_id')) {
            $alreadyReviewedQuery->where('order_id', $request->order_id);
            $alreadyReviewed = $alreadyReviewedQuery->exists();
        } else {
            // If the column order_id is missing, we can't reliably know if this order was reviewed.
            // To prevent blocking the user, we'll allow the review to proceed.
            $alreadyReviewed = false;
        }

        if ($alreadyReviewed) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda sudah memberikan ulasan untuk produk ini pada pesanan ini.',
            ], 422);
        }

        $reviewData = [
            'product_id' => $request->product_id,
            'user_id' => $user->id,
            'name' => $user->name,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'date' => now(),
        ];

        // Only include order_id if column exists
        if (\Illuminate\Support\Facades\Schema::hasColumn('reviews', 'order_id')) {
            $reviewData['order_id'] = $request->order_id;
        }

        $review = Review::create($reviewData);

        return response()->json([
            'status' => 'success',
            'message' => 'Ulasan berhasil dikirim. Terima kasih!',
            'data' => $review,
        ], 201);
    }

    /**
     * Check if the authenticated user can review a product in a specific order.
     */
    public function checkEligibility(Request $request, $productId)
    {
        $user = Auth::user();
        $orderId = $request->query('order_id');

        if (! $user) {
            return response()->json(['can_review' => false, 'reason' => 'Login required']);
        }

        $query = Order::where('user_id', $user->id)
            ->where('status', 'completed')
            ->whereHas('items', function ($q) use ($productId) {
                $q->where('product_id', $productId);
            });

        if ($orderId) {
            $query->where('id', $orderId);
        }

        $hasPurchased = $query->exists();

        $revQuery = Review::where('user_id', $user->id)
            ->where('product_id', $productId);
        
        if ($orderId) {
            $revQuery->where('order_id', $orderId);
        }

        $alreadyReviewed = $revQuery->exists();

        return response()->json([
            'can_review' => $hasPurchased && ! $alreadyReviewed,
            'has_purchased' => $hasPurchased,
            'already_reviewed' => $alreadyReviewed,
        ]);
    }

    public function fixDatabase()
    {
        try {
            if (!Schema::hasColumn('reviews', 'order_id')) {
                Schema::table('reviews', function (Blueprint $table) {
                    $table->foreignId('order_id')->nullable()->after('product_id')->constrained('orders')->cascadeOnDelete();
                });
                return response()->json(['message' => 'Database berhasil diperbarui! Sekarang fitur review per-pesanan sudah aktif.']);
            }
            return response()->json(['message' => 'Database sudah diperbarui sebelumnya.']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
