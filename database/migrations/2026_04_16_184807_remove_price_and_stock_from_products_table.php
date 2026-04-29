<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Migrate existing price/stock data to variants
        $products = DB::table('products')->get();
        
        foreach ($products as $product) {
            // Check if this product already has variants
            $hasVariants = DB::table('product_variants')
                ->where('product_id', $product->id)
                ->exists();

            if (!$hasVariants && (isset($product->price) || isset($product->stock))) {
                DB::table('product_variants')->insert([
                    'product_id' => $product->id,
                    'name'       => 'Standard',
                    'price'      => $product->price ?? 0,
                    'stock'      => $product->stock ?? 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 2. Drop the columns
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['price', 'stock']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('price', 15, 2)->nullable();
            $table->integer('stock')->default(0);
        });
    }
};
