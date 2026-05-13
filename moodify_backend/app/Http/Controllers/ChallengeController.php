<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\UserBadge;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ChallengeController extends Controller
{
    // Listar retos del usuario autenticado
    public function index(Request $request) {
        $challenges = Challenge::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($challenges);
    }

    // Marcar el día de hoy como completado
    public function markDay($id, Request $request) {
        try {
            $userId = Auth::id();
            // Aseguramos que el reto pertenece al usuario
            $challenge = Challenge::where('user_id', $userId)->findOrFail($id);
            
            $today = Carbon::today()->toDateString();

            // Verificar si ya existe un registro para hoy en la tabla de logs
            $exists = DB::table('challenge_logs')
                ->where('challenge_id', $id)
                ->whereDate('date', $today)
                ->exists();

            if ($exists) {
                return response()->json(['error' => 'Ya has marcado este reto hoy'], 422);
            }

            // Usar transacción para asegurar que el log y el incremento ocurran juntos
            return DB::transaction(function () use ($challenge, $id, $today, $userId) {
                DB::table('challenge_logs')->insert([
                    'challenge_id' => $id,
                    'date' => $today,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                $challenge->increment('current_days');
                $challenge->refresh();

                // LÓGICA DE LOGROS (BADGES)
                
                // Logro id 6: Completar un reto (llegar al total de días)
                if ($challenge->current_days >= $challenge->total_days) {
                    UserBadge::firstOrCreate([
                        'user_id' => $userId, 
                        'badge_id' => 6
                    ], ['unlocked_at' => now()]);
                }

                // Logro id 3: Tener 3 o más retos creados
                if (Challenge::where('user_id', $userId)->count() >= 3) {
                    UserBadge::firstOrCreate([
                        'user_id' => $userId, 
                        'badge_id' => 3
                    ], ['unlocked_at' => now()]);
                }

                return response()->json($challenge);
            });

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['error' => 'Reto no encontrado'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al marcar reto: ' . $e->getMessage()], 500);
        }
    }

    // Crear un nuevo reto
    public function store(Request $request) {
        try {
            $v = $request->validate([
                'name' => 'required|string|max:255',
                'icon' => 'required|string',
                'color' => 'required|string',
                'total_days' => 'required|integer|min:1'
            ]);

            $challenge = Challenge::create([
                'user_id'      => Auth::id(),
                'name'         => $v['name'],
                'icon'         => $v['icon'],
                'color'        => $v['color'],
                'total_days'   => $v['total_days'],
                'current_days' => 0 
            ]);

            return response()->json($challenge, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => 'No se pudo crear el reto'], 500);
        }
    }

    // Eliminar un reto
    public function destroy($id) {
        $userId = Auth::id();
        $deleted = Challenge::where('id', $id)->where('user_id', $userId)->delete();
        
        if ($deleted) {
            // Opcional: Eliminar también los logs del reto eliminado
            DB::table('challenge_logs')->where('challenge_id', $id)->delete();
            return response()->json(['success' => true]);
        }

        return response()->json(['error' => 'No se pudo eliminar o no tienes permisos'], 403);
    }
}