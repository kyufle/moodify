<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffAnnouncement extends Model
{
    use HasFactory;

    // These must match the keys in your $request->validate() call
    protected $fillable = [
        'title',
        'content',
        'tag',
        'icon',
        'colors'
    ];

    // Since 'colors' is sent as an array, tell Laravel to cast it
    protected $casts = [
        'colors' => 'array',
    ];
}