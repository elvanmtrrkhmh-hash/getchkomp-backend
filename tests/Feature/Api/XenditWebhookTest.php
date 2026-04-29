<?php

namespace Tests\Feature\Api;

use App\Models\Order;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class XenditWebhookTest extends TestCase
{
    use RefreshDatabase;

    protected string $token = 'test_callback_token';

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.xendit.callback_token' => $this->token]);
    }

    public function test_webhook_processes_valid_payload(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'external_id' => $order->order_number,
            'amount' => 100000,
            'status' => 'PENDING',
        ]);

        $payload = [
            'external_id' => $order->order_number,
            'status' => 'PAID',
            'payment_channel' => 'BCA',
            'payment_method' => 'VIRTUAL_ACCOUNT',
        ];

        $response = $this->postJson('/api/webhooks/xendit', $payload, [
            'x-callback-token' => $this->token,
        ]);

        $response->assertStatus(200);
        $response->assertJson(['status' => 'success']);

        $payment->refresh();
        $order->refresh();

        $this->assertEquals('PAID', $payment->status);
        $this->assertEquals('BCA', $payment->payment_channel);
        $this->assertEquals('VIRTUAL_ACCOUNT', $payment->payment_method);
        $this->assertEquals('paid', $order->payment_status);
        $this->assertEquals('completed', $order->status);
    }

    public function test_webhook_rejects_invalid_token(): void
    {
        $response = $this->postJson('/api/webhooks/xendit', [], [
            'x-callback-token' => 'wrong_token',
        ]);

        $response->assertStatus(403);
    }

    public function test_webhook_handles_expired_status(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'user_id' => $user->id,
            'status' => 'pending',
            'payment_status' => 'pending',
        ]);

        $payment = Payment::create([
            'order_id' => $order->id,
            'external_id' => $order->order_number,
            'amount' => 100000,
            'status' => 'PENDING',
        ]);

        $payload = [
            'external_id' => $order->order_number,
            'status' => 'EXPIRED',
        ];

        $response = $this->postJson('/api/webhooks/xendit', $payload, [
            'x-callback-token' => $this->token,
        ]);

        $order->refresh();
        $payment->refresh();

        $this->assertEquals('EXPIRED', $payment->status);
        $this->assertEquals('expired', $order->payment_status);
        $this->assertEquals('canceled', $order->status);
    }

    public function test_webhook_returns_404_if_payment_not_found(): void
    {
        $payload = [
            'external_id' => 'NON-EXISTENT',
            'status' => 'PAID',
        ];

        $response = $this->postJson('/api/webhooks/xendit', $payload, [
            'x-callback-token' => $this->token,
        ]);

        $response->assertStatus(404);
    }
}
