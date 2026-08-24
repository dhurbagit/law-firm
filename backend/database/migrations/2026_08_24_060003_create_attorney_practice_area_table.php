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
        Schema::create('attorney_practice_area', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attorney_id')->constrained('attorneys')->cascadeOnDelete();
            $table->foreignId('practice_area_id')->constrained('practice_areas')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['attorney_id', 'practice_area_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attorney_practice_area');
    }
};
