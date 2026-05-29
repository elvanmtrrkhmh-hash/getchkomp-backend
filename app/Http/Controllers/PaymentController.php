<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Http\Requests\UpdatePaymentRequest;
use App\Models\Order;
use App\Models\Payment;
use App\Services\XenditService;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(XenditService $xenditService)
    {
        $payments = Payment::with('order')->latest()->paginate(10);

        // Proactive Sync: Sync pending payments in the current page
        foreach ($payments as $payment) {
            if ($payment->payment_status === 'pending') {
                $xenditService->syncPayment($payment);
            }
        }

        return Inertia::render('Payments/Index', ['payments' => $payments->fresh('order')]);
    }

    public function create()
    {
        return Inertia::render('Payments/Create', [
            'orders' => Order::orderBy('id', 'desc')->get(['id']),
        ]);
    }

    public function store(StorePaymentRequest $request)
    {
        Payment::create($request->validated());

        return redirect()->route('payments.index')->with('success', 'Payment berhasil dibuat.');
    }

    public function show(Payment $payment)
    {
        return Inertia::render('Payments/Show', ['payment' => $payment]);
    }

    public function edit(Payment $payment)
    {
        return Inertia::render('Payments/Edit', [
            'payment' => $payment,
            'orders' => Order::orderBy('id', 'desc')->get(['id']),
        ]);
    }

    public function update(UpdatePaymentRequest $request, Payment $payment)
    {
        $payment->update($request->validated());

        return redirect()->route('payments.index')->with('success', 'Payment berhasil diperbarui.');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return redirect()->route('payments.index')->with('success', 'Payment berhasil dihapus.');
    }
}
