<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductListResource extends JsonResource
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
            'name' => $this->name,
            'price' => (float) $this->price,
            'image' => $this->thumbnail ? url(\Illuminate\Support\Facades\Storage::url($this->thumbnail)) : null,
            'thumbnail' => $this->thumbnail ? url(\Illuminate\Support\Facades\Storage::url($this->thumbnail)) : null,
            'category' => $this->category ? $this->category->name : null,
            'brand' => $this->brand ? $this->brand->name : null,
            'stock' => (int) $this->stock,
            'availability' => [
                'status' => $this->stock > 0 ? 'in_stock' : 'out_of_stock',
                'label' => $this->stock > 0 ? 'Tersedia' : 'Habis Stok',
            ],
        ];
    }
}
