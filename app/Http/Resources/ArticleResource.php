<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'content' => $this->content,
            'thumbnail' => $this->thumbnail ? (str_starts_with($this->thumbnail, 'http') ? $this->thumbnail : asset('storage/' . $this->thumbnail)) : null,
            'image' => $this->thumbnail ? (str_starts_with($this->thumbnail, 'http') ? $this->thumbnail : asset('storage/' . $this->thumbnail)) : null, // Frontend uses .image
            'banner_url' => $this->thumbnail ? (str_starts_with($this->thumbnail, 'http') ? $this->thumbnail : asset('storage/' . $this->thumbnail)) : null,
            'status' => $this->status,
            'author' => $this->user->name ?? 'Anonymous', // Frontend L77 uses directly as string
            'author_details' => [
                'id' => $this->user->id ?? null,
                'name' => $this->user->name ?? 'Anonymous',
            ],
            'category' => $this->category->name ?? 'General', 
            'tags' => $this->tags->pluck('name')->toArray(), 
            'category_details' => [
                'id' => $this->category->id ?? null,
                'name' => $this->category->name ?? 'General',
                'slug' => $this->category->slug ?? 'general',
            ],
            'tags_details' => $this->tags->map(fn($tag) => [
                'id' => $tag->id,
                'name' => $tag->name,
                'slug' => $tag->slug,
            ]),
            'date' => $this->created_at->isoFormat('LL'), // Frontend L79 uses .date
            'created_at' => $this->created_at->toDateTimeString(),
            'created_at_human' => $this->created_at->diffForHumans(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];
    }
}
