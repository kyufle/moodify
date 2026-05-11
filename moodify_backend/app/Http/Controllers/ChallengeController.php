<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\UserBadge;
use App\Models\Habit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChallengeController extends Controller
{
    public function index(Request $request) {
        return response()->json(Challenge::where('user_id', $request->user()->id)->get());
    }

public function markDay($id, Request $request) {
        try {
            $user = $request->user();
            $challenge = Challenge::where('user_id', $user->id)->findOrFail($id);
            $today = Carbon::today()->format('Y-m-d');
            $exists = DB::table('challenge_logs')
                ->where('challenge_id', $id)
                ->whereDate('date', $today)
                ->exists();

            if ($exists) {
                return response()->json(['error' => 'Ya has marcado este reto hoy'], 422);
            }

            DB::table('challenge_logs')->insert([
                'challenge_id' => $id,
                'date' => $today,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            $challenge->increment('current_days');
            if ($challenge->current_days >= $challenge->total_days) {
                UserBadge::firstOrCreate([
                    'user_id' => $user->id, 'badge_id' => '6'
                ], ['unlocked_at' => now()]);
            }

            if (Challenge::where('user_id', $user->id)->count() >= 3) {
                UserBadge::firstOrCreate([
                    'user_id' => $user->id, 'badge_id' => '3'
                ], ['unlocked_at' => now()]);
            }

            return response()->json($challenge->refresh());

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al marcar reto'], 500);
        }
    }

    public function store(Request $request) {
        try {
            $v = $request->validate([
                'name' => 'required|string|max:255',
                'icon' => 'required|string',
                'color' => 'required|string',
                'total_days' => 'required|integer|min:1'
            ]);

            $challenge = Challenge::create([
                'user_id'      => $request->user()->id,
                'name'         => $v['name'],
                'icon'         => $v['icon'],
                'color'        => $v['color'],
                'total_days'   => $v['total_days'],
                'current_days' => 0 
            ]);

            return response()->json($challenge, 201);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id) {
        Challenge::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }
}