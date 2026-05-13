<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MoodRegister extends Model
{
    protected $table = 'mood_registers';

    protected $fillable = [
        'user_id',
        'mood',
        'date',
        'daily_text'
    ];
}