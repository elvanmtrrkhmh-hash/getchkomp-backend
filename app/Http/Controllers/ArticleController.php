<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleCategory;
use App\Models\ArticleTag;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ArticleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $articles = Article::with(['user:id,name', 'category:id,name', 'tags:id,name'])->latest()->paginate(10);
        return Inertia::render('Articles/Index', [
            'articles' => $articles
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Articles/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArticleRequest $request)
    {
        $data = $request->validated();
        $slug = Str::slug($request->title) . '-' . Str::random(5);
        
        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('articles/thumbnails', 'public');
        }

        $categoryId = null;
        if ($request->filled('category')) {
            $category = ArticleCategory::firstOrCreate(
                ['name' => $request->category],
                ['slug' => Str::slug($request->category)]
            );
            $categoryId = $category->id;
        }

        $article = Article::create([
            'title' => $request->title,
            'slug' => $slug,
            'content' => $request->content,
            'thumbnail' => $thumbnailPath,
            'status' => $request->status,
            'article_category_id' => $categoryId,
            'user_id' => auth()->id(),
        ]);

        if ($request->filled('tags')) {
            $tagNames = array_filter(array_map('trim', explode(',', $request->tags)));
            $tagIds = [];
            foreach ($tagNames as $tagName) {
                $tag = ArticleTag::firstOrCreate(
                    ['name' => $tagName],
                    ['slug' => Str::slug($tagName)]
                );
                $tagIds[] = $tag->id;
            }
            $article->tags()->sync($tagIds);
        } else {
            $article->tags()->sync([]);
        }

        return redirect()->route('articles.index')->with('success', 'Article created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $article = Article::with(['user:id,name', 'tags:id,name', 'category'])->findOrFail($id);
        
        // Convert tags to comma-separated string for the frontend
        $article->tags_string = $article->tags->pluck('name')->implode(', ');
        // Convert category to name for the frontend
        $article->category_name = $article->category?->name || '';
        
        return Inertia::render('Articles/Edit', [
            'article' => $article
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateArticleRequest $request, $id)
    {
        $article = Article::findOrFail($id);
        $data = $request->validated();

        $updateData = [
            'title' => $request->title,
            'content' => $request->content,
            'status' => $request->status,
        ];

        if ($request->has('category')) {
            if ($request->filled('category')) {
                $category = ArticleCategory::firstOrCreate(
                    ['name' => $request->category],
                    ['slug' => Str::slug($request->category)]
                );
                $updateData['article_category_id'] = $category->id;
            } else {
                $updateData['article_category_id'] = null;
            }
        }

        if ($request->title !== $article->title) {
            $updateData['slug'] = Str::slug($request->title) . '-' . Str::random(5);
        }

        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail if exists
            if ($article->thumbnail) {
                Storage::disk('public')->delete($article->thumbnail);
            }
            $updateData['thumbnail'] = $request->file('thumbnail')->store('articles/thumbnails', 'public');
        }

        $article->update($updateData);

        if ($request->has('tags')) {
            $tagNames = array_filter(array_map('trim', explode(',', $request->tags)));
            $tagIds = [];
            foreach ($tagNames as $tagName) {
                $tag = ArticleTag::firstOrCreate(
                    ['name' => $tagName],
                    ['slug' => Str::slug($tagName)]
                );
                $tagIds[] = $tag->id;
            }
            $article->tags()->sync($tagIds);
        } else {
            $article->tags()->sync([]);
        }

        return redirect()->route('articles.index')->with('success', 'Article updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $article = Article::find($id);
        if ($article->thumbnail) {
            Storage::disk('public')->delete($article->thumbnail);
        }
        
        $article->delete();

        return redirect()->route('articles.index')->with('success', 'Article deleted successfully.');
    }
}
