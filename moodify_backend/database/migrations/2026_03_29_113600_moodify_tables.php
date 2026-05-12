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
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique();
            $table->enum('type_user', ['admin', 'user'])->default('user');
            $table->integer('points')->default(0);
            $table->integer('streak')->default(0);
            $table->timestamp('last_streak_day')->nullable();
            $table->string('image_id')->nullable();
            $table->timestamp('last_seen_at')->nullable();
            $table->string('theme_color')->default('#6366F1');
            $table->string('bg_image')->nullable();
            $table->string('my_msg_color')->default('#6366F1');
            $table->string('other_msg_color')->default('#b4c2d1');
            $table->string('text_colorOwn')->default('#FFFFFF');
            $table->string('text_colorOther')->default('#FFFFFF');
        });

        Schema::create('habits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('icon');
            $table->string('color');
            $table->string('time')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('habit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('habit_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->timestamps();
            $table->unique(['habit_id', 'date']);
        });

        Schema::create('challenges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('icon');
            $table->string('color');
            $table->integer('current_days')->default(0);
            $table->integer('total_days');
            $table->timestamps();
        });

        Schema::create('challenge_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('challenge_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->timestamps();
            $table->unique(['challenge_id', 'date']);
        });

        Schema::create('user_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('badge_id');
            $table->timestamp('unlocked_at')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'badge_id']);
        });

        Schema::create('sleep_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->nullable();
            $table->date('date')->nullable();
            $table->dateTime('start_time')->nullable();
            $table->dateTime('end_time')->nullable();
            $table->integer('total_minutes')->nullable();
        });

        Schema::create('stress_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('total_score');
            $table->json('breakdown');
            $table->timestamps();
        });

        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['ai', 'p2p']);
            $table->string('label')->nullable();
            $table->foreignId('recipient_id')->nullable()->constrained('users');
            $table->boolean('is_blocked')->default(false);
            $table->foreignId('blocked_by')->nullable()->constrained('users');
            $table->timestamps();
        });

        Schema::create('messages_ai', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversations_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['user', 'assistant']);
            $table->longText('content');
            $table->string('mood_detected')->nullable();
            $table->timestamps();
        });

        Schema::create('messages_p2p', function (Blueprint $table) {
            $table->id();
            $table->foreignId('conversations_id')->constrained()->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->text('content')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('mood_registers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('mood', [
                'happy',
                'glad',
                'excited',
                'calm',
                'proud',
                'confident',
                'grateful',
                'in_love',
                'peaceful',
                'sad',
                'angry',
                'scared',
                'anxious',
                'annoyed',
                'frustrated',
                'embarrassed',
                'lonely',
                'worried',
                'furious',
                'tired',
                'sleepy',
                'bored',
                'confused',
                'surprised',
                'serious',
                'shy',
                'hungry'
            ]);
            $table->timestamp('date')->nullable();
            $table->text('daily_text')->nullable();

            $table->timestamps();
        });
        Schema::create('todo_lists', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100);
            $table->string('time_quantity', 100);
            $table->string('times_for_week', 100);
            $table->boolean('completed')->default(false);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
        });

        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100);
            $table->text('text_publications');
            $table->timestamp('date');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
        });
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('publication_id')->constrained('publications')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('text_comments');
            $table->timestamp('date');
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade');
        });
        Schema::create('post_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('publication_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->unique(['user_id', 'publication_id']);
        });

        Schema::create('user_blocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blocker_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('blocked_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['blocker_id', 'blocked_id']);
        });
        Schema::create('followed_follower', function (Blueprint $table) {
            $table->foreignId('follower_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('followed_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->primary(['follower_id', 'followed_id']);
        });
        Schema::create('dismissed_alerts', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->string('alert_type'); // Guardará 'like', 'comment', o 'follow'
        $table->unsignedBigInteger('reference_id'); // El ID del post_like, comment, o followed_id
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
