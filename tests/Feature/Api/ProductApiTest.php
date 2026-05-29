<?php

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('returns latest products in correct order and structure', function () {
    $category = Category::factory()->create(['name' => 'Monitors']);

    // Create an old product
    $oldProduct = Product::factory()->create([
        'name' => 'TitanDisplay Old',
        'category_id' => $category->id,
        'created_at' => now()->subDays(10),
    ]);

    // Create 8 new products
    $newProducts = Product::factory()->count(8)->create([
        'category_id' => $category->id,
        'created_at' => now(),
    ]);

    $response = $this->getJson('/api/products');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'status',
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'price',
                    'image',
                    'category' => [
                        'id',
                        'name',
                    ],
                ],
            ],
        ]);

    // Verify it only returns 8 products (the latest ones)
    $response->assertJsonCount(8, 'data');

    // Verify TitanDisplay Old is NOT in the response (because it's the 9th oldest)
    $response->assertJsonMissing(['name' => 'TitanDisplay Old']);
    
    // Verify the first item is one of the new ones
    $data = $response->json('data');
    expect($data[0]['name'])->not->toBe('TitanDisplay Old');
});
