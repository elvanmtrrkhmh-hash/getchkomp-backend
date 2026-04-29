<?php

namespace Tests\Feature\Api;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Payment;
use App\Services\XenditService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class OrderCheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_checkout_and_receive_xendit_url(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'price' => 100000,
            'stock' => 10
        ]);

        // Mock XenditService to avoid real API calls
        $this->mock(XenditService::class, function (MockInterface $mock) {
            $mock->shouldReceive('createInvoice')
                ->once()
                ->andReturn(new Payment(['checkout_url' => 'https://checkout.xendit.co/web/123']));
        });

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/customer/orders', [
                'items' => [
                    [
                        'product_id' => $product->id,
                        'quantity' => 1,
                    ],
                ],
                'shipping_address' => 'Jl. Test No. 123',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'checkout_url' => 'https://checkout.xendit.co/web/123',
                ],
            ]);

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'total_amount' => 100000,
            'status' => 'pending',
        ]);
    }

    public function test_checkout_validation_works(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/customer/orders', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['items', 'shipping_address']);
    }
}
