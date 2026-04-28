<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'label'
    ];

    // Relación: Una conversación pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relación: Una conversación tiene muchos mensajes de IA
    public function messagesAi()
    {
        return $this->hasMany(MessageAi::class, 'conversations_id');
    }

    // Relación: Una conversación tiene muchos mensajes entre humanos
    public function messagesP2P()
    {
        return $this->hasMany(MessageP2P::class, 'conversations_id');
    }
}