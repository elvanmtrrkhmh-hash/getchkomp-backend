<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use App\Models\User;
use App\Notifications\ReviewReminderNotification;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::latest()->paginate(10);

        return Inertia::render('Orders/Index', ['orders' => $orders]);
    }

    public function create()
    {
        return Inertia::render('Orders/Create', [
            'users' => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreOrderRequest $request)
    {
        Order::create($request->validated());

        return redirect()->route('orders.index')->with('success', 'Order berhasil dibuat.');
    }

    public function show(Order $order)
    {
        return Inertia::render('Orders/Show', ['order' => $order]);
    }

    public function edit(Order $order)
    {
        return Inertia::render('Orders/Edit', [
            'order' => $order,
            'users' => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateOrderRequest $request, Order $order)
    {
        $oldStatus = $order->status;
        $order->update($request->validated());
        $newStatus = $order->status;

        // Trigger review reminder if status changed to finished
        $finishedStatuses = ['delivered', 'completed', 'success'];
        if (! in_array($oldStatus, $finishedStatuses) && in_array($newStatus, $finishedStatuses)) {
            if ($order->user) {
                $order->user->notify(new ReviewReminderNotification($order));
            }
        }

        return redirect()->route('orders.index')->with('success', 'Order berhasil diperbarui.');
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return redirect()->route('orders.index')->with('success', 'Order berhasil dihapus.');
    }
}
