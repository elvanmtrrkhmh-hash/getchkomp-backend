<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|integer',
            'total_amount' => 'required|numeric',
            'status' => 'required|string|in:pending,paid,shipped,cancelled',
            'order_date' => 'required|date',
            'shipping_address' => 'nullable|string|max:255',
            'payment_status' => 'required|string|in:pending,paid,shipped,cancelled',

        ];
    }
}
