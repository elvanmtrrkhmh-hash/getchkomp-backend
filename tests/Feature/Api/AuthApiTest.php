<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('a user can register as a customer', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'address' => '123 Main St',
        'phone_number' => '08123456789'
    ]);

    $response->assertStatus(201)
        ->assertJson([
            'message' => 'Registration successful',
            'error' => false
        ])
        ->assertJsonStructure([
            'user',
            'token'
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
        'role' => 'user'
    ]);
});

test('registration requires mandatory fields', function () {
    $response = $this->postJson('/api/register', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});

test('a user can login', function () {
    $user = User::factory()->create([
        'email' => 'jane@example.com',
        'password' => 'password123',
        'role' => 'user'
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'jane@example.com',
        'password' => 'password123'
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Login successful',
            'error' => false
        ])
        ->assertJsonStructure([
            'user',
            'token'
        ]);
});

test('login fails with invalid credentials', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => 'password'
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'test@example.com',
        'password' => 'wrongpassword'
    ]);

    $response->assertStatus(401)
        ->assertJson([
            'message' => 'Invalid email or password',
            'error' => true
        ]);
});

test('a user can logout', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test-token')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->postJson('/api/logout');

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Logout successful',
            'error' => false
        ]);
    
    $this->assertEmpty($user->tokens);
});

test('a user can view their profile', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test-token')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->getJson('/api/me');

    $response->assertStatus(200)
        ->assertJsonPath('data.email', $user->email);
});
