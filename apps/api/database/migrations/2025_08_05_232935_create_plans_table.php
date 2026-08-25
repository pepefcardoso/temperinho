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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('badge')->nullable();
            $table->boolean('is_popular')->default(false);
            $table->unsignedInteger('price')->default(0);
            $table->string('period')->default('monthly');
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->string('status')->default('active');
            $table->integer('display_order')->default(0);
            $table->unsignedInteger('max_users')->nullable();
            $table->unsignedInteger('max_posts')->nullable();
            $table->unsignedInteger('max_recipes')->nullable();
            $table->unsignedInteger('max_banners')->nullable();
            $table->unsignedInteger('max_email_campaigns')->nullable();
            $table->boolean('newsletter')->default(false);
            $table->unsignedInteger('trial_days')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
