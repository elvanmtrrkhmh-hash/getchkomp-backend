<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Models\Brand;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function index()
    {
        $brands = Brand::latest()->paginate(10);

        return Inertia::render('Brands/Index', ['brands' => $brands]);
    }

    public function create()
    {
        return Inertia::render('Brands/Create');
    }

    public function store(StoreBrandRequest $request)
    {
        Brand::create($request->validated());

        return redirect()->route('brands.index')->with('success', 'Brand berhasil dibuat.');
    }

    public function show(Brand $brand)
    {
        return Inertia::render('Brands/Show', ['brand' => $brand]);
    }

    public function edit(Brand $brand)
    {
        return Inertia::render('Brands/Edit', ['brand' => $brand]);
    }

    public function update(UpdateBrandRequest $request, Brand $brand)
    {
        $brand->update($request->validated());

        return redirect()->route('brands.index')->with('success', 'Brand berhasil diperbarui.');
    }

    public function destroy(Brand $brand)
    {
        $brand->delete();

        return redirect()->route('brands.index')->with('success', 'Brand berhasil dihapus.');
    }
}
