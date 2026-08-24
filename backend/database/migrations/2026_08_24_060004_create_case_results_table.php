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
        Schema::create('case_results', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique()->index();
            $table->string('settlement_verdict');
            $table->foreignId('practice_area_id')->constrained('practice_areas')->cascadeOnDelete();
            $table->foreignId('lead_attorney_id')->constrained('attorneys')->cascadeOnDelete();
            $table->text('summary');
            $table->integer('case_year');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_results');
    }
};
