<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\{postJson, getJson, actingAs};

uses(RefreshDatabase::class);

test('customer can register', function () {
    $response = postJson('/api/customer/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(201)
             ->assertJsonPath('user.role', 'customer');
    
    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
        'role' => 'customer'
    ]);
});

test('admin can register', function () {
    $response = postJson('/api/admin/register', [
        'name' => 'Admin User',
        'email' => 'admin@example.com',
        'password' => 'adminpass123',
        'password_confirmation' => 'adminpass123',
    ]);

    $response->assertStatus(201)
             ->assertJsonPath('user.role', 'admin');
    
    $this->assertDatabaseHas('users', [
        'email' => 'admin@example.com',
        'role' => 'admin'
    ]);
});

test('customer cannot login as admin', function () {
    $customer = User::factory()->create(['role' => 'customer', 'password' => 'password123']);

    $response = postJson('/api/admin/login', [
        'email' => $customer->email,
        'password' => 'password123',
    ]);

    $response->assertStatus(401)
             ->assertJson(['error' => true]);
});

test('admin cannot login as customer', function () {
    $admin = User::factory()->create(['role' => 'admin', 'password' => 'password123']);

    $response = postJson('/api/customer/login', [
        'email' => $admin->email,
        'password' => 'password123',
    ]);

    $response->assertStatus(401)
             ->assertJson(['error' => true]);
});

test('customer can access customer profile but not admin profile', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $token = $customer->createToken('test-token')->plainTextToken;

    $response = getJson('/api/customer/me', [
        'Authorization' => "Bearer $token"
    ]);
    $response->assertStatus(200);

    $response = getJson('/api/admin/me', [
        'Authorization' => "Bearer $token"
    ]);
    $response->assertStatus(403);
});

test('admin can access admin profile but not customer profile', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $token = $admin->createToken('test-token')->plainTextToken;

    $response = getJson('/api/admin/me', [
        'Authorization' => "Bearer $token"
    ]);
    $response->assertStatus(200);

    $response = getJson('/api/customer/me', [
        'Authorization' => "Bearer $token"
    ]);
    $response->assertStatus(403);
});
