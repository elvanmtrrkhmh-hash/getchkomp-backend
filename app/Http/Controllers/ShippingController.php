<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShippingRequest;
use App\Http\Requests\UpdateShippingRequest;
use App\Models\Order;
use App\Models\Shipping;
use Inertia\Inertia;

class ShippingController extends Controller
{
    public function index()
    {
        $shippings = Shipping::latest()->paginate(10);

        return Inertia::render('Shipping/Index', ['shippings' => $shippings]);
    }

    public function create()
    {
        return Inertia::render('Shipping/Create', [
            'orders' => Order::orderBy('id', 'desc')->get(['id']),
        ]);
    }

    public function store(StoreShippingRequest $request)
    {
        Shipping::create($request->validated());

        return redirect()->route('shipping.index')->with('success', 'Shipping berhasil dibuat.');
    }

    public function show(Shipping $shipping)
    {
        return Inertia::render('Shipping/Show', ['shipping' => $shipping]);
    }

    public function edit(Shipping $shipping)
    {
        return Inertia::render('Shipping/Edit', [
            'shipping' => $shipping,
            'orders'   => Order::orderBy('id', 'desc')->get(['id']),
        ]);
    }

    public function update(UpdateShippingRequest $request, Shipping $shipping)
    {
        $shipping->update($request->validated());

        return redirect()->route('shipping.index')->with('success', 'Shipping berhasil diperbarui.');
    }

    public function destroy(Shipping $shipping)
    {
        $shipping->delete();

        return redirect()->route('shipping.index')->with('success', 'Shipping berhasil dihapus.');
    }
}
