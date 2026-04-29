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
        // 1. Add price & stock to products table
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('price', 15, 2)->after('brand_id')->nullable();
            $table->integer('stock')->after('price')->default(0);
        });

        // 2. Migrate existing price/stock data from the first variant
        $products = DB::table('products')->get();
        foreach ($products as $product) {
            $firstVariant = DB::table('product_variants')
                ->where('product_id', $product->id)
                ->orderBy('id')
                ->first();

            if ($firstVariant) {
                DB::table('products')->where('id', $product->id)->update([
                    'price' => $firstVariant->price,
                    'stock' => $firstVariant->stock,
                ]);
            }
        }

        // 3. Cleanup order_items table
        Schema::table('order_items', function (Blueprint $table) {
            if (Schema::hasColumn('order_items', 'variant_id')) {
                // Determine the correct constraint name. 
                // Based on previous inspection it was 'order_items_variant_id_foreign'
                $table->dropForeign(['variant_id']);
                $table->dropColumn('variant_id');
            }
        });

        // 4. Drop the product_variants table
        Schema::dropIfExists('product_variants');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reconstruction in down() might be complex and data is already collapsed.
        // For the sake of this architectural shift, we won't provide full rollback
        // but we can restore the table structure.
        
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('price', 15, 2);
            $table->integer('stock')->default(0);
            $table->timestamps();
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreignId('variant_id')->nullable()->after('product_id')->constrained('product_variants')->onDelete('set null');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['price', 'stock']);
        });
    }
};
