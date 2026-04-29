<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;

test('catalog returns products with filters and pagination', function () {
    $brand = Brand::factory()->create(['name' => 'Apple']);
    $category = Category::factory()->create(['name' => 'Laptops']);
    
    Product::factory()->count(5)->create([
        'brand_id' => $brand->id,
        'category_id' => $category->id,
    ]);

    $response = $this->get('/api/catalog', ['Accept' => 'application/json']);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'status',
            'filters' => [
                'brands' => [['id', 'name']],
                'categories' => [['id', 'name']],
            ],
            'products' => [
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'price',
                        'rating',
                        'thumbnail',
                        'brand',
                        'category',
                        'availability',
                    ]
                ],
                'meta',
                'links',
            ]
        ]);
});

test('catalog can be filtered by brand', function () {
    $brand1 = Brand::factory()->create(['name' => 'Apple']);
    $brand2 = Brand::factory()->create(['name' => 'Samsung']);
    
    Product::factory()->create(['brand_id' => $brand1->id, 'name' => 'MacBook']);
    Product::factory()->create(['brand_id' => $brand2->id, 'name' => 'Galaxy']);

    $response = $this->get("/api/catalog?brand={$brand1->id}", ['Accept' => 'application/json']);

    $response->assertStatus(200)
        ->assertJsonCount(1, 'products.data')
        ->assertJsonPath('products.data.0.name', 'MacBook');
});

test('catalog can be searched', function () {
    Product::factory()->create(['name' => 'Unique Gaming Laptop']);
    Product::factory()->create(['name' => 'Normal Office Mouse']);

    $response = $this->get('/api/catalog?search=Gaming', ['Accept' => 'application/json']);

    $response->assertStatus(200)
        ->assertJsonCount(1, 'products.data')
        ->assertJsonPath('products.data.0.name', 'Unique Gaming Laptop');
});

test('catalog can be sorted by price', function () {
    Product::factory()->create(['name' => 'Cheap', 'price' => 100]);
    Product::factory()->create(['name' => 'Expensive', 'price' => 1000]);

    // Price Ascending
    $response = $this->get('/api/catalog?sort=price_asc', ['Accept' => 'application/json']);
    $response->assertJsonPath('products.data.0.name', 'Cheap');

    // Price Descending
    $response = $this->get('/api/catalog?sort=price_desc', ['Accept' => 'application/json']);
    $response->assertJsonPath('products.data.0.name', 'Expensive');
});

test('product availability is calculated correctly', function () {
    // Out of stock
    $product = Product::factory()->create(['stock' => 0]);
    
    $response = $this->get('/api/catalog', ['Accept' => 'application/json']);
    $response->assertJsonPath('products.data.0.availability.status', 'out_of_stock');

    // In stock
    $product->update(['stock' => 10]);
    
    $response = $this->get('/api/catalog', ['Accept' => 'application/json']);
    $response->assertJsonPath('products.data.0.availability.status', 'in_stock');
});

test('catalog detail returns full product data', function () {
    $product = Product::factory()->create();
    \App\Models\Review::factory()->count(3)->create(['product_id' => $product->id]);

    $response = $this->get("/api/catalog/{$product->id}", ['Accept' => 'application/json']);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'status',
            'product' => [
                'id',
                'name',
                'description',
                'images',
                'reviews',
                'brand',
                'category',
                'availability',
                'specs',
                'options',
            ]
        ]);
});
