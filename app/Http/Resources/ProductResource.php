<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $totalStock = (int) $this->stock;
        $inStock = $totalStock > 0;

        return [
            'id' => $this->id,
            'name' => $this->name,

            // Price: always a float
            'price' => (float) $this->price,

            // Rating: float with 1 decimal, null if not set
            'rating' => $this->rating !== null ? round((float) $this->rating, 1) : null,

            // Media: full absolute URLs
            'thumbnail' => $this->thumbnail
                ? url(Storage::url($this->thumbnail))
                : null,
            'images' => collect($this->images ?? [])
                ->map(fn ($path) => url(Storage::url($path)))
                ->values()
                ->toArray(),

            // Flags
            'featured' => (bool) $this->isFeatured,
            'bestseller' => (bool) $this->isBestseller,

            // Relations — null-safe
            'brand' => $this->brand ? [
                'id' => $this->brand->id,
                'name' => $this->brand->name,
            ] : null,
            'category' => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ] : null,

            // Metadata
            'specs' => $this->specs ?? (object) [],
            'options' => $this->options ?? (object) [],

            // Availability
            'availability' => [
                'in_stock' => $inStock,
                'total_stock' => (int) $totalStock,
                'is_low_stock' => $inStock && (int) $totalStock <= 5,
                'status' => $inStock ? 'in_stock' : 'out_of_stock',
                'label' => $inStock ? 'Tersedia' : 'Stok Habis',
            ],

            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
