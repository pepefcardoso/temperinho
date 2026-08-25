<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rl_post_topics', function (Blueprint $table) {
            $table->id();
            $table->unsignedBiginteger('post_id')->unsigned();
            $table->unsignedBiginteger('post_topic_id')->unsigned();
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
            $table->foreign('post_topic_id')->references('id')->on('post_topics')->onDelete('cascade');
            $table->timestamps();

            $table->index('post_id');
            $table->index('post_topic_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rl_post_topics');
    }
};
