<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageAi extends Model
{
    use HasFactory;

    // Indicamos el nombre exacto de la tabla en tu migración
    protected $table = 'messages_ai';

    protected $fillable = [
        'conversations_id',
        'role',
        'content',
        'mood_detected'
    ];

    // Relación: El mensaje pertenece a una conversación
    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversations_id');
    }
}