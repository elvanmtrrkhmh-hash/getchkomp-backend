<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'features' => $this->features ?? $this->key_features,
            'colors' => $this->colors ?? $this->available_colors,
            'overview' => $this->overview ?? $this->product_overview,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'category_id' => 'required|integer',
            'brand_id' => 'required|integer',
            'rating' => 'nullable|numeric|min:0|max:5',
            'thumbnail' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'images' => ['required', 'array'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'isFeatured' => 'nullable|boolean',
            'isBestseller' => 'nullable|boolean',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'features.*' => 'required|string',
            'overview' => 'nullable|array',
            'overview.*' => 'required|string',
            'colors' => 'nullable|array',
            'options' => 'nullable|array',
            'colors.*' => 'required|string|max:100',
            'specs' => 'nullable|array',
            'specs.*' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ];
    }
}
