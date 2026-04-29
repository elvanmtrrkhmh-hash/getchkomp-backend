<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->string('external_id')->unique()->after('order_id');
            $table->decimal('amount', 15, 2)->after('external_id');
            $table->string('payment_channel')->nullable()->after('amount');
            $table->string('status')->default('PENDING')->after('payment_channel');
            $table->string('checkout_url')->nullable()->after('status');
            $table->json('metadata')->nullable()->after('checkout_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'external_id',
                'amount',
                'payment_channel',
                'status',
                'checkout_url',
                'metadata',
            ]);
        });
    }
};
