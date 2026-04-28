<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageP2P extends Model
{
    use HasFactory;

    protected $table = 'messages_p2p';

    protected $fillable = [
        'conversations_id',
        'sender_id',
        'content',
        'read_at'
    ];

    public function conversation()
    {
        return $this->belongsTo(Conversation::class, 'conversations_id');
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}