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
        Schema::create('treatment_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->foreignId('appointment_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name', 50);
            $table->text('description')->nullable();
            $table->string('tooth_number', 50)->nullable();
            $table->decimal('cost', 10, 2)->default(0);  
            $table->enum('payment_status', ['unpaid', 'partially_paid', 'paid'])->default('unpaid');  
            $table->enum('status', ['مخطط', 'قيد التنفيذ', 'مكتمل', 'ملغى'])->default('مخطط');
            $table->timestamps();

            $table->index(['patient_id', 'created_at']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('treatment_records');
    }
};
