<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MessageAi extends Model
{
    use HasFactory;

    protected $table = 'messages_ai';

    protected $fillable = [
        'conversations_id',
        'role',
        'content',
        'mood_detected'
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class, 'conversations_id');
    }
}