<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Http\Request;


class UserController extends Controller
{
    /**
     * Muestra una lista de todos los usuarios.
     */
    public function index()
    {
        // Recuperamos todos los registros de la tabla 'users'
        $users = User::all();

        // Opción A: Retornar una vista (Para aplicaciones web)
        // return view('users.index', compact('users'));

        // Opción B: Retornar JSON (Para APIs)
        return response()->json($users);
    }

    public function streakRegister()
    {
        $userId = auth()->user()->id;
        $user = User::where('id', $userId)->first();

        if ($user) {
            if ($user->streak_login && $user->streak_login->isToday()) {
                return response()->json(['message' => 'Ya has registrado tu progreso hoy'], 400);
            }
            $user->last_streak_day = $user->streak_login;
            $user->streak_login = now();
            $user->points += 3;
            $user->streak += 1;
            $user->save();
            return response()->json([
                'ok' => true,
                'message' => 'Progreso registrado con éxito',
                'user' => $user
            ], 200);
        } else {
            return response()->json(['ok' => false, 'message' => 'Usuario no encontrado'], 404);
        }
    }

    public function actionAlert()
    {
        $user = auth()->user();
        $todayMoods = DB::table('mood_registers')
            ->where('user_id', $user->id)
            ->whereDate('date', now()->today())
            ->orderBy('created_at', 'desc')
            ->get();

        if ($todayMoods->isNotEmpty()) {
            return response()->json([
                'ok' => true,
                'exists' => true,
                'all_moods' => $todayMoods,
                'last_mood' => $todayMoods->first()->mood,
                'message' => 'Has registrado ' . $todayMoods->count() . ' veces hoy'
            ], 200);
        }

        return response()->json(['ok' => true, 'exists' => false]);
    }
}