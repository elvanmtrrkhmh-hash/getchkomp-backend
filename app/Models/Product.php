<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'category_id', 'brand_id', 'price', 'stock', 'rating', 'thumbnail',
        'images', 'isFeatured', 'isBestseller', 'description',
        'features', 'overview', 'colors', 'options', 'specs',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'features' => 'array',
            'overview' => 'array',
            'colors' => 'array',
            'options' => 'array',
            'specs' => 'array',
            'isFeatured' => 'boolean',
            'isBestseller' => 'boolean',
            'rating' => 'float',
            'price' => 'float',
            'stock' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Scope a query to search products.
     */
    public function scopeSearch($query, ?string $search)
    {
        return $query->when($search, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        });
    }

    /**
     * Scope a query to filter products.
     */
    public function scopeFilter($query, array $filters)
    {
        return $query
            ->when($filters['category'] ?? null, function ($query, $category) {
                // Accept category ID (numeric) or name (string)
                if (is_numeric($category)) {
                    $query->where('category_id', (int) $category);
                } else {
                    $query->whereHas('category', fn ($q) => $q->where('name', 'like', "%{$category}%"));
                }
            })
            ->when($filters['brand'] ?? null, function ($query, $brand) {
                if (is_numeric($brand)) {
                    $query->where('brand_id', (int) $brand);
                } else {
                    $query->whereHas('brand', fn ($q) => $q->where('name', 'like', "%{$brand}%"));
                }
            });
    }

    /**
     * Scope a query to sort products.
     */
    public function scopeSort($query, ?string $sort)
    {
        // Support both underscore and hyphen format: price_asc / price-asc
        $normalized = $sort ? str_replace('-', '_', $sort) : null;

        if ($normalized === 'price_asc' || $normalized === 'price_desc') {
            $direction = $normalized === 'price_asc' ? 'asc' : 'desc';

            return $query->orderBy('price', $direction);
        }

        return match ($normalized) {
            'rating' => $query->orderBy('rating', 'desc'),
            'newest' => $query->latest(),
            'oldest' => $query->oldest(),
            default => $query->latest(),
        };
    }
}
