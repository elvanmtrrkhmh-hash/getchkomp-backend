<?php

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Review;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('non-admin users are logged out and redirected', function () {
    $user = User::factory()->create(['role' => 'user']);
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('admin users can see the dashboard with correct props', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    
    // Seed some data
    Product::factory()->count(3)->create();
    $user = User::factory()->create(['role' => 'user']);
    Order::factory()->count(2)->create(['user_id' => $user->id, 'payment_status' => 'paid', 'total_amount' => 1000]);
    Review::factory()->count(1)->create(['product_id' => Product::first()->id]);

    $this->actingAs($admin);

    $response = $this->get(route('dashboard'));
    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->has('stats', fn (Assert $page) => $page
            ->has('totalProducts')
            ->has('totalOrders')
            ->has('totalCustomers')
            ->has('totalRevenue')
        )
        ->has('salesData')
        ->has('recentOrders')
        ->has('recentActivities')
    );
});
