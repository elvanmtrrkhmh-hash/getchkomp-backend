<?php

namespace Database\Factories;

use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => \App\Models\Product::factory(),
            'name' => $this->faker->name(),
            'rating' => $this->faker->randomFloat(2, 1, 5),
            'date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'comment' => $this->faker->paragraph(),
        ];
    }
}
