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
        Schema::create('surgeries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->dateTime('date');
            $table->text('description')->nullable();
            $table->decimal('cost', 10, 2);
            $table->enum('status', ['مجدول', 'مكتمل', 'تم الإلغاء', 'لايوجد'])
                  ->default('مجدول');
            $table->timestamps();

            $table->index('date');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surgeries');
    }
};
