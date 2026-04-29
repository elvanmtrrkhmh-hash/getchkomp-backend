<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(): Response
    {
        $stats = [
            'totalProducts' => Product::count(),
            'totalOrders' => Order::count(),
            'totalCustomers' => User::where('role', '!=', 'admin')->count(),
            'totalRevenue' => Order::where('payment_status', 'paid')->sum('total_amount'),
        ];

        // Sales data for the chart (last 30 days)
        $salesData = Order::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(total_amount) as revenue'),
            DB::raw('COUNT(*) as orders')
        )
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Recent orders
        $recentOrders = Order::with('user')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn ($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer' => $order->user->name ?? 'Guest',
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'date' => $order->created_at->diffForHumans(),
            ]);

        // Recent activities aggregation
        $activities = collect();

        // New Users
        User::latest()->limit(5)->get()->each(function ($user) use ($activities) {
            $activities->push([
                'id' => 'user-' . $user->id,
                'type' => 'user',
                'title' => 'New user registered',
                'description' => "{$user->name} joined the platform.",
                'time' => $user->created_at->diffForHumans(),
                'icon' => 'UserPlus',
                'color' => 'blue',
            ]);
        });

        // New Orders
        Order::latest()->limit(5)->get()->each(function ($order) use ($activities) {
            $activities->push([
                'id' => 'order-' . $order->id,
                'type' => 'order',
                'title' => 'New order received',
                'description' => "Order #{$order->order_number} was placed.",
                'time' => $order->created_at->diffForHumans(),
                'icon' => 'ShoppingBag',
                'color' => 'green',
            ]);
        });

        // New Reviews
        Review::with('product')->latest()->limit(5)->get()->each(function ($review) use ($activities) {
            $activities->push([
                'id' => 'review-' . $review->id,
                'type' => 'review',
                'title' => 'New review submitted',
                'description' => "{$review->name} rated {$review->product->name} {$review->rating}/5.",
                'time' => $review->created_at->diffForHumans(),
                'icon' => 'Star',
                'color' => 'yellow',
            ]);
        });

        $recentActivities = $activities->sortByDesc(fn ($a) => $a['time'])->values()->take(8);

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'salesData' => $salesData,
            'recentOrders' => $recentOrders,
            'recentActivities' => $recentActivities,
        ]);
    }
}
