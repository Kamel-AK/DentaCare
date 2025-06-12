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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->time('time');
            $table->enum('status', ['مجدول', 'مكتمل', 'تم الإلغاء', 'لايوجد'])
                  ->default('مجدول');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['date', 'time']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
