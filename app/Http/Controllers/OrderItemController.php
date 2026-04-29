<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderItemRequest;
use App\Http\Requests\UpdateOrderItemRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Inertia\Inertia;

class OrderItemController extends Controller
{
    public function index()
    {
        $orderItems = OrderItem::latest()->paginate(10);

        return Inertia::render('OrderItems/Index', ['orderItems' => $orderItems]);
    }

    public function create()
    {
        return Inertia::render('OrderItems/Create', [
            'orders'   => Order::orderBy('id', 'desc')->get(['id']),
            'products' => Product::orderBy('name')->get(['id', 'name', 'price']),
        ]);
    }

    public function store(StoreOrderItemRequest $request)
    {
        OrderItem::create($request->validated());

        return redirect()->route('order-items.index')->with('success', 'OrderItem berhasil dibuat.');
    }

    public function show(OrderItem $orderItem)
    {
        return Inertia::render('OrderItems/Show', ['orderItem' => $orderItem]);
    }

    public function edit(OrderItem $orderItem)
    {
        return Inertia::render('OrderItems/Edit', [
            'orderItem' => $orderItem,
            'orders'    => Order::orderBy('id', 'desc')->get(['id']),
            'products'  => Product::orderBy('name')->get(['id', 'name', 'price']),
        ]);
    }

    public function update(UpdateOrderItemRequest $request, OrderItem $orderItem)
    {
        $orderItem->update($request->validated());

        return redirect()->route('order-items.index')->with('success', 'OrderItem berhasil diperbarui.');
    }

    public function destroy(OrderItem $orderItem)
    {
        $orderItem->delete();

        return redirect()->route('order-items.index')->with('success', 'OrderItem berhasil dihapus.');
    }
}
