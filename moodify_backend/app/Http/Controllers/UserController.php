<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function streakRegister(Request $request)
    {
        try {
            $user = $request->user();
            $tz = 'Europe/Madrid';
            $clientDate = $request->client_date ? now()->parse($request->client_date)->timezone($tz) : now()->timezone($tz);

            if (!$user->last_streak_day) {
                $user->streak += 1;
                $user->points += 3;
                $user->last_streak_day = $clientDate;
                $user->save();
                return response()->json(['user' => $user], 200);
            }

            $todayStr = $clientDate->format('Y-m-d');
            $lastLogin = now()->parse($user->last_streak_day)->timezone($tz);
            $lastLoginStr = $lastLogin->format('Y-m-d');

            if ($todayStr === $lastLoginStr) {
                return response()->json(['ok' => false, 'message' => 'Ya registrado hoy', 'user' => $user], 200);
            }

            $currentStart = $clientDate->copy()->startOfDay();
            $lastStart = Carbon::parse($user->last_streak_day)->timezone($tz)->startOfDay();
            $diff = $lastStart->diffInDays($currentStart);

            if ($diff == 1) {
                $user->last_streak_day = $clientDate;
                $user->streak += 1;
                $user->points += 3;
            } else if ($diff > 1) {
                $daysLost = $diff - 1;
                $cost = $daysLost * 6;

                if ($request->recover && $user->points >= $cost) {
                    $user->points -= $cost;
                    $user->last_streak_day = $clientDate;
                    $user->streak += 1;
                } else {
                    $user->streak = 1;
                    $user->points += 3;
                    $user->last_streak_day = $clientDate;
                }
            }

            $user->save();
            return response()->json(['ok' => true, 'message' => 'Registrado correctamente', 'user' => $user], 200);

        } catch (\Exception $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    }

    public function index()
    {
        return response()->json(User::all());
    }

    public function actionAlert(Request $request)
    {
        $user = $request->user();
        $todayMoods = DB::table('mood_registers')
            ->where('user_id', $user->id)
            ->whereDate('date', now()->toDateString())
            ->get();

        return response()->json(['ok' => true, 'exists' => $todayMoods->isNotEmpty(), 'user' => $user]);
    }

    public function saveSleepLog(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'total_minutes' => 'required|integer',
        ]);

        DB::table('sleep_logs')->updateOrInsert(
            ['user_id' => auth()->id(), 'date' => $validated['date']],
            [
                'start_time' => date('Y-m-d H:i:s', strtotime($validated['start_time'])),
                'end_time' => date('Y-m-d H:i:s', strtotime($validated['end_time'])),
                'total_minutes' => $validated['total_minutes'],
            ]
        );
        return response()->json(['message' => 'Sueño guardado']);
    }

    public function fillInHours()
    {
        $exist = DB::table('sleep_logs')
            ->where('user_id', auth()->id())
            ->whereDate('date', now()->toDateString())
            ->first();
        return $exist ? response()->json($exist) : response()->json(null, 204);
    }
}