<?php

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\CustomerAuthController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\XenditController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/**
 * Public Routes
 */
Route::get('/home', [HomeController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);

Route::get('/catalog', [CatalogController::class, 'index']);
Route::get('/catalog/{product}', [CatalogController::class, 'show']);

Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);

Route::post('/webhooks/xendit', [XenditController::class, 'webhook']);
Route::get('/payments/sync/{external_id}', [XenditController::class, 'syncPayment']);
Route::get('/fix-database', [ReviewController::class, 'fixDatabase']);

/**
 * Customer Auth Routes
 */
Route::prefix('customer')->group(function () {
    Route::post('/register', [CustomerAuthController::class, 'register']);
    Route::post('/login', [CustomerAuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
        Route::get('/me', [CustomerAuthController::class, 'profile']);
        Route::post('/logout', [CustomerAuthController::class, 'logout']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/orders', [OrderController::class, 'store']);
        Route::patch('/orders/{id}/complete', [OrderController::class, 'complete']);
        Route::get('/reviews/check/{productId}', [ReviewController::class, 'checkEligibility']);
        Route::post('/reviews', [ReviewController::class, 'store']);
    });
});

/**
 * Admin Auth Routes
 */
Route::post('/login', [AdminAuthController::class, 'login']);
Route::prefix('admin')->group(function () {
    Route::post('/register', [AdminAuthController::class, 'register']); // Restricted in production
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
        Route::get('/me', [AdminAuthController::class, 'profile']);
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        // Add other admin-only API routes here
    });
});

/**
 * Backward Compatibility / Legacy Routes (Optional)
 * You can remove these if existing clients are updated to use the new prefixes.
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return response()->json([
            'message' => 'Profile retrieved',
            'data' => $request->user(),
            'error' => false,
        ]);
    });
});
