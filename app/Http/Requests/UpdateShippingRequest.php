<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShippingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => 'required|integer',
            'shipping_status' => 'required|string',
            'tracking_number' => 'nullable|string|max:255',
            'shipping_date' => 'nullable|date',
            'estimated_delivery_date' => 'nullable|date',

        ];
    }
}
