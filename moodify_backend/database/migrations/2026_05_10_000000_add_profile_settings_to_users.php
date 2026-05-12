<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_public')->default(true);
            $table->boolean('show_in_community')->default(true);
            $table->boolean('notifications_enabled')->default(true);
            $table->string('app_bg')->default('default');
            $table->string('language')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_public', 'show_in_community', 'notifications_enabled', 'app_bg', 'language']);
        });
    }
};
