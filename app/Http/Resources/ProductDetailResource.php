<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductDetailResource extends JsonResource
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
            'description' => $this->description,
            'price' => (float) $this->price,
            'rating' => $this->rating !== null ? round((float) $this->rating, 1) : null,
            'brand' => $this->brand ? [
                'id' => $this->brand->id,
                'name' => $this->brand->name,
            ] : null,
            'category' => $this->category ? [
                'id' => $this->category->id,
                'name' => $this->category->name,
            ] : null,
            'featured' => $this->isFeatured,
            'bestseller' => $this->isBestseller,
            'thumbnail' => $this->thumbnail ? url(Storage::url($this->thumbnail)) : null,
            'images' => collect($this->images ?? [])->map(fn ($path) => url(Storage::url($path)))->toArray(),
            'features' => $this->features ?? [],
            'overview' => $this->overview ?? [],
            'colors' => $this->colors ?? [],
            'options' => $this->options,
            'specs' => $this->specs ?? (object) [],
            'availability' => [
                'status' => $inStock ? 'in_stock' : 'out_of_stock',
                'label' => $inStock ? 'Tersedia' : 'Stok Habis',
                'color' => $inStock ? 'green' : 'red',
            ],
            'stock_status' => [
                'total_stock' => (int) $totalStock,
                'is_low_stock' => $inStock && $totalStock < 5,
                'status' => $inStock ? 'In Stock' : 'Out of Stock',
            ],
            'reviews' => $this->reviews->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'rating' => (float) $r->rating,
                'date' => optional($r->created_at)->format('Y-m-d'),
                'comment' => $r->comment,
            ]),
        ];
    }
}
