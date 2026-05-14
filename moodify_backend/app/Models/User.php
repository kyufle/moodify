<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'username',
        'password',
        'last_streak_day',
        'last_seen_at',
        'bg_image',
        'my_msg_color',
        'other_msg_color',
        'text_colorOwn',
        'text_colorOther',
        'is_public',
        'show_in_community',
        'notifications_enabled',
        'app_bg',
        'language',
        'image_id',
    ];

    
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'last_seen_at' => 'datetime',
            'last_streak_day' => 'datetime',
            'is_public' => 'boolean',
            'notifications_enabled' => 'boolean',
        ];
    }
}