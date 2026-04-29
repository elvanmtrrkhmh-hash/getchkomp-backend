<?php

namespace Database\Factories;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => \App\Models\Order::factory(),
            'external_id' => 'ORD-' . strtoupper(\Illuminate\Support\Str::random(10)),
            'amount' => 100000,
            'status' => 'PENDING',
            'checkout_url' => $this->faker->url,
            'metadata' => [],
        ];
    }
}
