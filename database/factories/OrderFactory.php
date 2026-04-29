<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => \App\Models\User::factory(),
            'total_amount' => $this->faker->randomFloat(2, 10000, 1000000),
            'status' => 'pending',
            'order_date' => now(),
            'shipping_address' => $this->faker->address,
            'payment_status' => 'pending',
        ];
    }
}
