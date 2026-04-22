<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StressLog extends Model
{
    protected $table = 'stress_logs';

    protected $fillable = [
        'user_id', 
        'total_score', 
        'breakdown'
    ];

    protected $casts = [
        'breakdown' => 'array',
    ];
}