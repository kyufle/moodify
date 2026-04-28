<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PsicologoService;
use App\Models\Conversation;
use App\Models\MessageAi;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    protected $psicologo;

    public function __construct(PsicologoService $psicologo)
    {
        $this->psicologo = $psicologo;
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'mensaje' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Mensaje inválido'], 400);
        }

        $userId = Auth::id();
        $mensajeUsuario = $request->input('mensaje');

        try {
            // 1. Buscamos la conversación AI del usuario o la creamos
            $conversacion = Conversation::firstOrCreate(
                ['user_id' => $userId, 'type' => 'ai'],
                ['label' => 'Sesión con Bloom']
            );

            // 2. Guardamos el mensaje de Valeria en messages_ai
            MessageAi::create([
                'conversations_id' => $conversacion->id,
                'role' => 'user',
                'content' => $mensajeUsuario
            ]);

            // 3. Obtenemos todo el historial de la DB para dárselo a Bloom
            // Así Bloom recordará lo que hablamos hace 5 minutos
            $historial = MessageAi::where('conversations_id', $conversacion->id)
                ->orderBy('created_at', 'asc')
                ->get(['role', 'content'])
                ->toArray();

            // 4. Llamamos al servicio de Bloom (pasándole el historial completo)
            $respuestaIA = $this->psicologo->chatear($historial);

            // 5. Guardamos la respuesta de Bloom en la base de datos
            MessageAi::create([
                'conversations_id' => $conversacion->id,
                'role' => 'assistant',
                'content' => $respuestaIA
            ]);

            return response()->json([
                'respuesta' => $respuestaIA,
                'status' => 'success'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'respuesta' => 'Lo siento, he tenido un pequeño lapsus mental.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}