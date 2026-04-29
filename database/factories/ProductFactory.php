<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'brand_id' => \App\Models\Brand::factory(),
            'category_id' => \App\Models\Category::factory(),
            'price' => $this->faker->randomFloat(2, 10, 2000),
            'stock' => $this->faker->numberBetween(0, 100),
            'rating' => $this->faker->randomFloat(2, 1, 5),
            'description' => $this->faker->paragraph(),
            'thumbnail' => $this->faker->imageUrl(),
            'isFeatured' => $this->faker->boolean(),
            'isBestseller' => $this->faker->boolean(),
        ];
    }
}
