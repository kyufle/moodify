<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conversation extends Model
{
    use HasFactory;

protected $fillable = [
    'user_id',
    'recipient_id',
    'type',
    'label',
    'is_blocked',
    'blocked_by'
];

    protected $appends = [
        'last_message', 
        'last_message_sender_id', 
        'last_message_at', 
        'unread_count'
    ];

    public function getLastMessageAttribute()
    {
        $last = $this->messagesP2P()->latest()->first();
        return $last ? $last->content : 'Toca para chatear';
    }

    public function getLastMessageSenderIdAttribute()
    {
        $last = $this->messagesP2P()->latest()->first();
        return $last ? $last->sender_id : null;
    }

    public function getLastMessageAtAttribute()
    {
        $last = $this->messagesP2P()->latest()->first();
        return $last ? $last->created_at : null;
    }

    public function getUnreadCountAttribute()
    {
        $myId = auth()->id();
        if (!$myId) return 0;

        return $this->messagesP2P()
            ->where('sender_id', '!=', $myId)
            ->whereNull('read_at')
            ->count();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recipient_id');
    }

    public function messagesAi(): HasMany
    {
        return $this->hasMany(MessageAi::class, 'conversations_id');
    }

    public function messagesP2P(): HasMany
    {
        return $this->hasMany(MessageP2P::class, 'conversations_id');
    }
}