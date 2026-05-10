<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PsicologoService;
use App\Models\Conversation;
use App\Models\MessageAi;
use App\Models\User;
use App\Models\MessageP2P; 
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    protected $psicologo;

    public function __construct(PsicologoService $psicologo)
    {
        $this->psicologo = $psicologo;
    }

    /**
     * Lista las conversaciones P2P del usuario logueado.
     */
public function index()
    {
        try {
            $userId = Auth::id();

            $conversations = Conversation::where('type', 'p2p')
                ->where(function($query) use ($userId) {
                    $query->where('user_id', $userId)
                          ->orWhere('recipient_id', $userId);
                })
                ->with(['user', 'recipient']) 
                ->get();

            $formatted = $conversations->map(function ($conv) use ($userId) {
                return [
                    'id' => $conv->id,
                    'user_id' => $conv->user_id,
                    'recipient_id' => $conv->recipient_id,
                    'user' => $conv->user,
                    'recipient' => $conv->recipient,
                    'updated_at' => $conv->updated_at,
                    
                    'last_message' => $conv->last_message,
                    'last_message_sender_id' => $conv->last_message_sender_id,
                    'last_message_at' => $conv->last_message_at,
                    'unread_count' => $conv->unread_count,
                ];
            });

            return response()->json($formatted);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

public function getMessagesByUserId($recipientId)
{
    try {
        $authUserId = Auth::id();
        $recipientId = (int)$recipientId;

        // Actualizar última conexión
        User::where('id', $authUserId)->update(['last_seen_at' => now()]);

        $recipient = User::find($recipientId);
        $isOnline = false;
        if ($recipient && $recipient->last_seen_at) {
            $isOnline = $recipient->last_seen_at->diffInSeconds(now()) < 30;
        }

        // --- SOLUCIÓN AL UNDEFINED ---
        // Buscamos la conversación, y si no existe (chat nuevo), la creamos al momento.
        // Así el frontend siempre recibe un ID válido en 'data.conversation.id'
        $conversation = Conversation::where('type', 'p2p')
            ->where(function($query) use ($authUserId, $recipientId) {
                $query->where(function($q) use ($authUserId, $recipientId) {
                    $q->where('user_id', $authUserId)->where('recipient_id', $recipientId);
                })->orWhere(function($q) use ($authUserId, $recipientId) {
                    $q->where('user_id', $recipientId)->where('recipient_id', $authUserId);
                });
            })
            ->first();

        if (!$conversation) {
            $conversation = Conversation::create([
                'user_id' => $authUserId,
                'recipient_id' => $recipientId,
                'type' => 'p2p',
                'label' => 'Chat Privado'
            ]);
        }

        $messages = MessageP2P::where('conversations_id', $conversation->id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'messages' => $messages,
            'recipient_online' => $isOnline,
            'conversation' => $conversation // Ahora esto NUNCA será null ni undefined
        ]);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    public function storeP2P(Request $request)
    {
        $request->validate([
            'mensaje' => 'required|string',
            'recipient_id' => 'required|integer'
        ]);

        $authUserId = Auth::id();
        $recipientId = (int)$request->recipient_id;

        $conversation = Conversation::where('type', 'p2p')
            ->where(function($query) use ($authUserId, $recipientId) {
                $query->where(function($q) use ($authUserId, $recipientId) {
                    $q->where('user_id', $authUserId)->where('recipient_id', $recipientId);
                })->orWhere(function($q) use ($authUserId, $recipientId) {
                    $q->where('user_id', $recipientId)->where('recipient_id', $authUserId);
                });
            })->first();

        if (!$conversation) {
            $conversation = new Conversation();
            $conversation->user_id = $authUserId;    
            $conversation->recipient_id = $recipientId;
            $conversation->type = 'p2p';
            $conversation->label = 'Chat Privado';
            $conversation->save();
        }

        $message = new MessageP2P();
        $message->conversations_id = $conversation->id; 
        $message->sender_id = $authUserId;
        $message->content = $request->mensaje;
        $message->save();

        return response()->json([
            'status' => 'saved',
            'conversation_id' => $conversation->id,
            'message' => $message
        ]);
    }

    public function searchUsers(Request $request)
    {
        $query = $request->query('q');
        $authUserId = Auth::id();

        if (!$query) return response()->json([]);

        $users = User::where('username', 'LIKE', "%{$query}%")
            ->where('id', '!=', $authUserId)
            ->get();

        $results = $users->map(function ($user) use ($authUserId) {
            $isFollowing = DB::table('followed_follower')
                ->where('follower_id', $authUserId)
                ->where('followed_id', $user->id)
                ->exists();

            return [
                'id' => $user->id,
                'username' => $user->username,
                'image_id' => $user->image_id,
                'is_following' => $isFollowing
            ];
        });

        return response()->json($results);
    }

    public function toggleFollow(Request $request)
    {
        $authUserId = Auth::id();
        $targetUserId = $request->followed_id;
        $exists = DB::table('followed_follower')->where('follower_id', $authUserId)->where('followed_id', $targetUserId)->first();

        if ($exists) {
            DB::table('followed_follower')->where('follower_id', $authUserId)->where('followed_id', $targetUserId)->delete();
            return response()->json(['status' => 'unfollowed']);
        } else {
            DB::table('followed_follower')->insert(['follower_id' => $authUserId, 'followed_id' => $targetUserId, 'created_at' => now(), 'updated_at' => now()]);
            return response()->json(['status' => 'followed']);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), ['mensaje' => 'required|string']);
        if ($validator->fails()) return response()->json(['error' => 'Mensaje inválido'], 400);

        $userId = Auth::id();
        try {
            $conversacion = Conversation::firstOrCreate(['user_id' => $userId, 'type' => 'ai'], ['label' => 'Sesión con Bloom']);
            MessageAi::create(['conversations_id' => $conversacion->id, 'role' => 'user', 'content' => $request->input('mensaje')]);
            $historial = MessageAi::where('conversations_id', $conversacion->id)->orderBy('created_at', 'asc')->get(['role', 'content'])->toArray();
            $respuestaIA = $this->psicologo->chatear($historial);
            MessageAi::create(['conversations_id' => $conversacion->id, 'role' => 'assistant', 'content' => $respuestaIA]);
            return response()->json(['respuesta' => $respuestaIA, 'status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['respuesta' => 'Error con la IA', 'error' => $e->getMessage()], 500);
        }
    }

public function markAsRead($senderId)
{
    try {
        $authUserId = Auth::id();
        
        $conversation = Conversation::where('type', 'p2p')
            ->where(function($query) use ($authUserId, $senderId) {
                $query->where(function($q) use ($authUserId, $senderId) {
                    $q->where('user_id', $authUserId)->where('recipient_id', $senderId);
                })->orWhere(function($q) use ($authUserId, $senderId) {
                    $q->where('user_id', $senderId)->where('recipient_id', $authUserId);
                });
            })->first();

        if ($conversation) {
            MessageP2P::where('conversations_id', $conversation->id)
                ->where('sender_id', '!=', $authUserId)
                ->whereNull('read_at')
                ->update(['read_at' => now()]);
        }

        return response()->json(['status' => 'success']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
}
