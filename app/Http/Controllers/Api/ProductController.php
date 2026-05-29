<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductListResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * GET /api/products
     *
     * Returns all the latest products from the database.
     */
    public function index(): JsonResponse
    {
        $products = Product::with('category')
            ->latest()
            ->take(8)
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => ProductListResource::collection($products),
        ]);
    }
}
