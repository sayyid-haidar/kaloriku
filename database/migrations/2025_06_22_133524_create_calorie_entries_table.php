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
        Schema::create('calorie_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            // Support both free text and database foods
            $table->string('food_name'); // Free text food name (primary)
            $table->foreignId('food_id')->nullable()->constrained('foods')->nullOnDelete(); // Optional reference to foods table

            // Simple calorie tracking
            $table->decimal('calories', 8, 2); // Direct calorie input
            $table->text('notes')->nullable(); // Optional notes (portion, brand, etc)

            // Tracking info
            $table->date('entry_date');
            $table->time('entry_time')->nullable(); // Optional time
            $table->enum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack'])->nullable(); // Optional meal categorization

            $table->timestamps();

            // Indexes for better performance
            $table->index(['user_id', 'entry_date']);
            $table->index('food_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calorie_entries');
    }
};
