<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    /**
     * Display a listing of published articles.
     */
    public function index(): JsonResponse
    {
        $articles = Article::with(['user:id,name', 'category', 'tags'])
            ->where('status', 'published')
            ->latest()
            ->paginate(12);

        return response()->json([
            'status' => 'success',
            'message' => 'Articles retrieved successfully',
            'data' => ArticleResource::collection($articles)->response()->getData(true),
        ]);
    }

    /**
     * Display the specified article by ID or Slug.
     */
    public function show($idOrSlug): JsonResponse
    {
        $article = Article::with(['user:id,name', 'category', 'tags'])
            ->where(function($query) use ($idOrSlug) {
                $query->where('id', $idOrSlug)
                      ->orWhere('slug', $idOrSlug);
            })
            ->first();

        if (!$article || $article->status !== 'published') {
            return response()->json([
                'status' => 'error',
                'message' => 'Article not found or not published',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Article retrieved successfully',
            'data' => new ArticleResource($article),
        ]);
    }
}
