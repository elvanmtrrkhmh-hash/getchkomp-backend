<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Product;
use App\Models\Review;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        $reviews = Review::latest()->paginate(10);

        return Inertia::render('Reviews/Index', ['reviews' => $reviews]);
    }

    public function create()
    {
        return Inertia::render('Reviews/Create', [
            'products' => Product::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreReviewRequest $request)
    {
        Review::create($request->validated());

        return redirect()->route('reviews.index')->with('success', 'Review berhasil dibuat.');
    }

    public function show(Review $review)
    {
        return Inertia::render('Reviews/Show', ['review' => $review]);
    }

    public function edit(Review $review)
    {
        return Inertia::render('Reviews/Edit', [
            'review'   => $review,
            'products' => Product::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateReviewRequest $request, Review $review)
    {
        $review->update($request->validated());

        return redirect()->route('reviews.index')->with('success', 'Review berhasil diperbarui.');
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return redirect()->route('reviews.index')->with('success', 'Review berhasil dihapus.');
    }
}
