<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Shipping extends Model
{
    protected $table = 'shipping';

    protected $fillable = [
        'order_id', 'shipping_status', 'tracking_number',
        'shipping_date', 'estimated_delivery_date',
    ];

    protected function casts(): array
    {
        return [
            'shipping_date' => 'datetime',
            'estimated_delivery_date' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
