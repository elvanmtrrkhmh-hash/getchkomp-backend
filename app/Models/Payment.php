<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    // Status Constants
    public const STATUS_PENDING = 'pending';

    public const STATUS_PAID = 'paid';

    public const STATUS_EXPIRED = 'expired';

    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'order_id',
        'external_id',
        'amount',
        'payment_channel',
        'status',
        'checkout_url',
        'metadata',
        'payment_method',
        'payment_status',
        'payment_date',
    ];

    protected function casts(): array
    {
        return [
            'payment_date' => 'datetime',
            'metadata' => 'array',
            'amount' => 'decimal:2',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
