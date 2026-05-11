<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MoodRegister;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MoodRegisterController extends Controller
{
    /**
     * Guarda un nuevo registro de estado de ánimo.
     */
    public function saveMood(Request $request)
    {
        try {
            // Establecemos la zona horaria de España para toda la ejecución de este método
            $tz = 'Europe/Madrid';
            
            $validated = $request->validate([
                'mood' => 'required|string',
                'daily_text' => 'nullable|string',
                'date' => 'nullable|date',
            ]);

            // Si no viene fecha del frontend, usamos la de España hoy
            $fechaFinal = $validated['date'] ?? Carbon::now($tz)->toDateString();

            $register = MoodRegister::create([
                'user_id' => $request->user()->id,
                'mood' => $validated['mood'],
                'daily_text' => $validated['daily_text'] ?? null,
                'date' => $fechaFinal,
            ]);

            // Forzamos que la respuesta también devuelva el objeto con la fecha parseada
            return response()->json([
                'ok' => true,
                'data' => $register
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'ok' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtiene los estados de ánimo del mes actual para el calendario.
     */
    public function getMoodCalendar(Request $request)
    {
        $user = $request->user();

        $registers = DB::table('mood_registers')
            ->where('user_id', $user->id)
            ->whereMonth('date', now()->month)
            ->orderBy('date', 'asc')
            ->get();

        $calendarData = [];

        foreach ($registers as $reg) {
            $day = Carbon::parse($reg->date)->format('Y-m-d');

            if (!isset($calendarData[$day])) {
                $calendarData[$day] = [];
            }
            $calendarData[$day][] = $reg->mood;
        }

        $finalGrid = [];
        foreach ($calendarData as $date => $moods) {
            if ($date === now()->toDateString()) {
                $finalGrid[$date] = end($moods);
            } else {
                $counts = array_count_values($moods);
                arsort($counts);
                $finalGrid[$date] = key($counts);
            }
        }

        return response()->json(['data' => $finalGrid]);
    }

    /**
     * Obtiene el historial (timeline) de los registros de hoy.
     */
    public function getTodayTimeline(Request $request)
    {
        $user = $request->user();

        $history = DB::table('mood_registers')
            ->where('user_id', $user->id)
            ->whereDate('date', now()->toDateString())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'mood' => $item->mood,
                    'time' => Carbon::parse($item->created_at)->toIso8601String(),
                    'text' => $item->daily_text
                ];
            });

        return response()->json($history);
    }
    public function getMonthlyStats(Request $request)
    {
        $user = $request->user();

        $stats = DB::table('mood_registers')
            ->where('user_id', $user->id)
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->select('mood', DB::raw('count(*) as total'))
            ->groupBy('mood')
            ->orderBy('total', 'desc')
            ->get();

        return response()->json($stats);
    }
    
    public function getDashboardInfo(Request $request)
    {
        $user = $request->user();
        $today = now()->toDateString();

        $lastMood = DB::table('mood_registers')
            ->where('user_id', $user->id)
            ->whereDate('date', $today)
            ->orderBy('created_at', 'desc')
            ->first();

        $sleepLog = DB::table('sleep_logs')
            ->where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        return response()->json([
            'lastMood' => $lastMood ? $lastMood->mood : null,
            'sleepMinutes' => $sleepLog ? $sleepLog->total_minutes : 0,
            'streak' => $user->streak
        ]);
    }
}