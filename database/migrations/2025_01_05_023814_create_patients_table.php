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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('name');  // Single field becaus the name in Arabic that will make the search more faster
            $table->string('contact_info', 20);
            $table->string('address', 100);
            $table->integer('age');
            $table->enum('gender', ['M', 'F']);
            $table->text('medical_history')->nullable();
            $table->string('file_number', 20)->unique();
            $table->timestamps();
            // Indexes
            $table->fullText(['name']);
            $table->index('file_number');
            $table->index('contact_info');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
