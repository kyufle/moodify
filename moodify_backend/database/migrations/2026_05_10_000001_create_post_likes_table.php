<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('post_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('publication_id');
            $table->foreign('publication_id')->references('id')->on('publications')->onDelete('cascade');
            $table->unique(['user_id', 'publication_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('post_likes');
    }
};
