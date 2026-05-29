<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'brand'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Products/Index', ['products' => $products]);
    }

    public function create()
    {
        return Inertia::render('Products/Create', [
            'brands' => Brand::orderBy('name')->get(['id', 'name']),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();

        // 🔹 Fix price agar integer tanpa .999
        if(isset($data['price'])){
            $data['price'] = (int) str_replace(['.', ','], '', $data['price']);
        }

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('products/thumbnails', 'public');
        }

        if ($request->hasFile('images')) {
            $images = [];
            foreach ($request->file('images') as $file) {
                if ($file instanceof UploadedFile) {
                    $images[] = $file->store('products/images', 'public');
                }
            }
            $data['images'] = $images;
        }

        // 🔹 Optional: manual Featured / Bestseller flag
        $data['is_featured'] = $request->has('featured') ? 1 : 0;
        $data['is_bestseller'] = $request->has('bestseller') ? 1 : 0;

        Product::create($data);

        return redirect()->route('products.index')->with('success', 'Product berhasil dibuat.');
    }

    public function show(Product $product)
    {
        return Inertia::render('Products/Show', [
            'product' => $product->load(['category', 'brand']),
        ]);
    }

    public function edit(Product $product)
    {
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'brands' => Brand::orderBy('name')->get(['id', 'name']),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();

        // 🔹 Fix price agar integer tanpa .999
        if(isset($data['price'])){
            $data['price'] = (int) str_replace(['.', ','], '', $data['price']);
        }

        if ($request->hasFile('thumbnail')) {
            $data['thumbnail'] = $request->file('thumbnail')->store('products/thumbnails', 'public');
        } else {
            unset($data['thumbnail']);
        }

        if ($request->has('images')) {
            $currentImages = collect($request->input('images'))->filter(fn ($img) => is_string($img))->values();
            $newImages = collect($request->file('images') ?? [])
                ->map(fn ($file) => $file->store('products/images', 'public'));

            $data['images'] = $currentImages->merge($newImages)->toArray();
        } else {
            unset($data['images']);
        }

        // 🔹 Optional: manual Featured / Bestseller flag
        $data['is_featured'] = $request->has('featured') ? 1 : 0;
        $data['is_bestseller'] = $request->has('bestseller') ? 1 : 0;

        $product->update($data);

        return redirect()->route('products.index')->with('success', 'Product berhasil diperbarui.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product berhasil dihapus.');
    }
}