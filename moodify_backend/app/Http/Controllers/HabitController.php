<?php

namespace App\Http\Controllers;

use App\Models\UserBadge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Habit;
use App\Models\HabitLog;

class HabitController extends Controller
{
    public function getWeeklyStatus(Request $request)
    {
        $user = $request->user();
        $tz = 'Europe/Madrid';
        $status = [];

        $totalHabitsCount = Habit::where('user_id', $user->id)->count();

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now($tz)->subDays($i);
            $dateStr = $date->format('Y-m-d');

            $logsCount = HabitLog::where('user_id', $user->id)
                ->whereDate('date', $dateStr)
                ->count();

            $status[] = [
                'day_label' => $date->translatedFormat('D'),
                'date' => $date,
                'is_today' => $date->isToday(),
                'full_completed' => ($totalHabitsCount > 0 && $logsCount >= $totalHabitsCount)
            ];
        }

        return response()->json($status);
    }
    public function getTodayHabits(Request $request)
    {
        try {
            $user = $request->user();
            $today = Carbon::today()->format('Y-m-d');

            $habits = DB::table('habits')
                ->where('habits.user_id', $user->id)
                ->leftJoin('habit_logs', function ($join) use ($today) {
                    $join->on('habits.id', '=', 'habit_logs.habit_id')
                        ->whereDate('habit_logs.date', $today);
                })
                ->select(
                    'habits.id',
                    'habits.name',
                    'habits.icon',
                    'habits.color',
                    DB::raw('CASE WHEN habit_logs.id IS NOT NULL THEN 1 ELSE 0 END as done')
                )
                ->orderBy('habits.created_at', 'desc')
                ->get();

            return response()->json($habits);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'required|string',
            'color' => 'required|string'
        ]);

        $habit = Habit::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'icon' => $request->icon,
            'color' => $request->color,
            'time' => 'Todo el día'
        ]);

        return response()->json($habit);
    }

 public function toggleHabit($id, Request $request)
    {
        try {
            $user = $request->user();
            $habit = Habit::where('user_id', $user->id)->findOrFail($id);
            $today = Carbon::today()->format('Y-m-d');

            $log = HabitLog::where('habit_id', $id)
                            ->whereDate('date', $today)
                            ->first();

            if ($log) {
                $log->delete();
                $isDone = false;
            } else {
                HabitLog::create([
                    'user_id' => $user->id,
                    'habit_id' => $id,
                    'date' => $today
                ]);
                $isDone = true;
                
                UserBadge::firstOrCreate([
                    'user_id' => $user->id,
                    'badge_id' => '1'
                ], ['unlocked_at' => now()]);
            }

            return response()->json(['success' => true, 'done' => $isDone]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al marcar hábito'], 500);
        }
    }    private function unlockBadge($user, $badgeId)
    {
        UserBadge::firstOrCreate([
            'user_id' => $user->id,
            'badge_id' => (string) $badgeId
        ], ['unlocked_at' => now()]);
    }

    public function checkLogros(Request $request)
    {
        $user = $request->user();
        $habits = Habit::where('user_id', $user->id)->get();

        if ($habits->count() >= 1)
            $this->unlockBadge($user, '1');
        if ($habits->count() >= 5)
            $this->unlockBadge($user, '2');
        if ($habits->count() >= 10)
            $this->unlockBadge($user, '4');

        $distinctIcons = $habits->pluck('icon')->unique()->count();
        if ($distinctIcons >= 3)
            $this->unlockBadge($user, '13');

        $distinctColors = $habits->pluck('color')->unique()->count();
        if ($distinctColors >= 4)
            $this->unlockBadge($user, '14');

        foreach ($habits as $h) {
            $name = strtolower($h->name);
            if (str_contains($name, 'mañana') || str_contains($name, 'desayuno'))
                $this->unlockBadge($user, '17');
            if ($h->icon === 'wind' || str_contains($name, 'meditar'))
                $this->unlockBadge($user, '18');
            if ($h->icon === 'book' || str_contains($name, 'leer'))
                $this->unlockBadge($user, '19');
            if ($h->icon === 'heart')
                $this->unlockBadge($user, '20');
        }

        return response()->json(['success' => true]);
    }
    public function destroy($id)
    {
        Habit::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }
}