<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;

class CustomerAuthController extends Controller
{
    /**
     * Handle customer registration.
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'address' => ['nullable', 'string', 'max:500'],
            'phone_number' => ['nullable', 'string', 'max:20'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password, // Password hashing handled by model casts
            'role' => 'customer',
            'address' => $request->address,
            'phone_number' => $request->phone_number,
            'join_date' => now(),
        ]);

        $token = $user->createToken('customer-token')->plainTextToken;

        return response()->json([
            'message' => 'Customer registration successful',
            'user' => $user,
            'token' => $token,
            'error' => false
        ], 201);
    }

    /**
     * Handle customer login.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required']
        ]);

        $user = User::where('email', $request->email)->where('role', 'customer')->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid customer credentials',
                'error' => true
            ], 401);
        }

        $token = $user->createToken('customer-token')->plainTextToken;

        return response()->json([
            'message' => 'Customer login successful',
            'user' => $user,
            'token' => $token,
            'error' => false
        ]);
    }

    /**
     * Handle logout.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout successful',
            'error' => false
        ]);
    }

    /**
     * Get customer profile.
     */
    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Customer profile retrieved successfully',
            'data' => $request->user(),
            'error' => false
        ]);
    }
}
