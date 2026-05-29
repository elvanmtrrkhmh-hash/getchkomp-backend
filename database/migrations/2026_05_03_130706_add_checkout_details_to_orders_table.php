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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('recipient_name')->nullable()->after('user_id');
            $table->string('phone_number')->nullable()->after('recipient_name');
            $table->string('city_district')->nullable()->after('shipping_address');
            $table->string('postal_code')->nullable()->after('city_district');
            $table->text('courier_notes')->nullable()->after('postal_code');
            $table->string('courier_name')->nullable()->after('courier_notes');
            $table->string('shipping_service')->nullable()->after('courier_name');
            $table->string('estimated_arrival')->nullable()->after('shipping_service');
            $table->decimal('shipping_cost', 12, 2)->default(0)->after('estimated_arrival');
            $table->string('payment_method_name')->nullable()->after('payment_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'recipient_name',
                'phone_number',
                'city_district',
                'postal_code',
                'courier_notes',
                'courier_name',
                'shipping_service',
                'estimated_arrival',
                'shipping_cost',
                'payment_method_name',
            ]);
        });
    }
};
