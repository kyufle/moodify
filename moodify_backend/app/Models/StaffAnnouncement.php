<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffAnnouncement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'tag',
        'icon',
        'colors'
    ];

    protected $casts = [
        'colors' => 'array',
    ];
}