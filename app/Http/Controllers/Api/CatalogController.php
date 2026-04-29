<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    /**
     * GET /api/catalog
     *
     * Query params:
     *   - search        : string — search by product name or description
     *   - category      : int|string — category ID or name (partial match)
     *   - brand         : int|string — brand ID or name (partial match)
     *   - sort          : newest|oldest|rating|price_asc|price_desc|price-asc|price-desc
     *   - page          : int (default: 1)
     *   - limit|per_page: int (default: 12)
     */
    public function index(Request $request): JsonResponse
    {
        // Support `limit` as alias for `per_page`
        $perPage = (int) ($request->input('limit') ?? $request->input('per_page', 12));
        $perPage = max(1, min(100, $perPage)); // clamp between 1 – 100

        $products = Product::with(['brand', 'category'])
            ->search($request->input('search'))
            ->filter($request->only(['category', 'brand']))
            ->sort($request->input('sort'))
            ->paginate($perPage, ['*'], 'page', $request->input('page', 1));

        $meta = [
            'current_page' => $products->currentPage(),
            'last_page' => $products->lastPage(),
            'per_page' => $products->perPage(),
            'total' => $products->total(),
            'from' => $products->firstItem(),
            'to' => $products->lastItem(),
        ];

        return response()->json([
            'status' => 'success',
            'filters' => [
                'brands' => Brand::select(['id', 'name'])->orderBy('name')->get(),
                'categories' => Category::select(['id', 'name'])->orderBy('name')->get(),
            ],
            'products' => ProductResource::collection($products)->response()->getData(true),
        ]);
    }

    /**
     * GET /api/catalog/{product}
     */
    public function show(Product $product): JsonResponse
    {
        $product->load(['brand', 'category', 'reviews']);

        return response()->json([
            'status' => 'success',
            'product' => new ProductDetailResource($product),
        ]);
    }
}
