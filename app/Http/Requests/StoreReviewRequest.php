<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'rating' => 'required|numeric|min:0|max:5',
            'date' => 'required|date',
            'comment' => 'nullable|string',

        ];
    }
}
