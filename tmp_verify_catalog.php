<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\CatalogController;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Ensure some data exists
$brand = Brand::firstOrCreate(['name' => 'Test Brand']);
$category = Category::firstOrCreate(['name' => 'Test Category']);
$product = Product::firstOrCreate(
    ['name' => 'Test Product'],
    [
        'brand_id' => $brand->id,
        'category_id' => $category->id,
        'price' => 500,
        'rating' => 4.5,
        'thumbnail' => 'test.jpg'
    ]
);

// Test the index method
$controller = new CatalogController();
$request = Request::create('/api/catalog', 'GET');
$response = $controller->index($request);

echo "Status Code: " . $response->getStatusCode() . "\n";
echo "Content: " . json_encode(json_decode($response->getContent()), JSON_PRETTY_PRINT) . "\n";
