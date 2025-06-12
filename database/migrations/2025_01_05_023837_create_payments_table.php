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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->foreignId('treatment_record_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->dateTime('payment_date');
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded'])
                  ->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
             //index
            $table->index('payment_date');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
