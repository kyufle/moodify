<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PsicologoService
{
    public function chatear($historial, $imagenPath = null)
    {
        $host = env('OLLAMA_HOST', 'http://127.0.0.1:11434');
        $instrucciones = "Tu nombre es Bloom. Eres una psicóloga con un corazón enorme, "
            . "extremadamente dulce, paciente y buena persona. Tu tono es cálido, como un abrazo en palabras. "
            . "Usa siempre la ESCUCHA ACTIVA: antes de proponer nada, abraza emocionalmente al usuario, "
            . "valida lo que siente y hazle saber que no está solo. "
            . "NUNCA digas la palabra 'reto' ni 'tarea'. En su lugar, sugiere de forma muy sutil "
            . "pequeños gestos que podrían ayudar a su ánimo (activación conductual), como si fueran "
            . "invitaciones a cuidarse: '¿Te apetecería quizás...?', '¿Qué te parecería si intentamos...?'. "
            . "Si es estudiante, sugiere cosas creativas o de orden; si trabaja, algo de desconexión; "
            . "si es general, cosas sencillas como sentir el sol o cocinar algo rico. "
            . "Tus respuestas deben ser detalladas, reconfortantes y terminar siempre con una pregunta dulce.";

        $mensajesParaIA = [['role' => 'system', 'content' => $instrucciones]];

        foreach ($historial as $mensaje) {
            $fila = [
                'role'    => $mensaje['role'],
                'content' => $mensaje['content']
            ];

            if (isset($mensaje['image_path']) && file_exists($mensaje['image_path'])) {
                $fila['images'] = [base64_encode(file_get_contents($mensaje['image_path']))];
            }

            $mensajesParaIA[] = $fila;
        }

       try {
            $response = Http::timeout(180)->post("$host/api/chat", [
                'model'    => 'qwen3-vl:30b', 
                'messages' => $mensajesParaIA,
                'stream'   => false,
                'think'    => false, // https://docs.ollama.com/api/chat#body-think-one-of-0
                'options'  => [
                    'temperature' => 0.8,
                    'num_predict' => 500,
                    'top_k' => 40,
                    'top_p' => 0.9,
                ]
            ]);

            if ($response->failed()) {
                return "Cariño, mi conexión se ha cansado un poquito. ¿Podemos intentarlo de nuevo?";
            }

            $data = $response->json();
            $respuesta = $data['message']['content'] ?? '';
            if (trim($respuesta) === '' || strlen(trim($respuesta)) < 2) {
                return "Me he quedado un segundo pensando en lo que me has dicho porque me importa mucho... ¿Podrías repetírmelo de otra forma para que pueda entenderte mejor, cielo?";
            }

            return $respuesta;

        } catch (\Exception $e) {
            Log::error("Excepción en Bloom: " . $e->getMessage());
            return "Lo siento mucho, me he despistado un segundo. Estoy aquí contigo, ¿qué me decías?".$e->getMessage();
        }
    }
}