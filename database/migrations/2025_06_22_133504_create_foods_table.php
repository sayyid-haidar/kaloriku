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
        Schema::create('foods', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Make name unique to avoid duplicates
            $table->decimal('calories_per_100g', 8, 2); // More precise calorie info
            $table->text('description')->nullable(); // Optional description
            $table->string('brand')->nullable(); // Optional brand
            $table->json('tags')->nullable(); // Flexible tags system
            $table->boolean('is_verified')->default(false); // Admin verified foods
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            // Indexes
            $table->index('name');
            $table->index('is_verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foods');
    }
};
