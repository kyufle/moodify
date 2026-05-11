<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserBadge;
use App\Models\Habit;
use App\Models\Challenge;
use App\Models\HabitLog;
use Carbon\Carbon;

class AchievementController extends Controller
{
    public function getAchievements(Request $request)
    {
        $user = $request->user();
        
        // 1. Datos necesarios
        $habits = Habit::where('user_id', $user->id)->get();
        $challenges = Challenge::where('user_id', $user->id)->get();
        $unlockedBadges = UserBadge::where('user_id', $user->id)->pluck('badge_id')->toArray();
        
        // 2. Ejecutar validaciones
        $this->checkAndUnlock($user, $habits, $challenges, $unlockedBadges);

        // 3. Respuesta limpia de IDs
        return response()->json([
            'unlocked_ids' => UserBadge::where('user_id', $user->id)->pluck('badge_id')
        ]);
    }

    private function checkAndUnlock($user, $habits, $challenges, $unlocked)
    {
        // --- GRUPO: HÁBITOS ---
        if (!in_array('1', $unlocked) && $habits->count() > 0) $this->saveBadge($user->id, '1');
        if (!in_array('13', $unlocked) && $habits->pluck('icon')->unique()->count() >= 3) $this->saveBadge($user->id, '13');
        if (!in_array('14', $unlocked) && $habits->pluck('color')->unique()->count() >= 4) $this->saveBadge($user->id, '14');

        // --- GRUPO: RETOS (CHALLENGES) ---
        // Logro 3: Ambicioso (3 retos creados)
        if (!in_array('3', $unlocked) && $challenges->count() >= 3) {
            $this->saveBadge($user->id, '3');
        }

        // Logro 5: Superviviente (50% de progreso en cualquier reto)
        if (!in_array('5', $unlocked)) {
            $halfway = $challenges->filter(fn($c) => $c->total_days > 0 && ($c->current_days >= $c->total_days / 2));
            if ($halfway->count() > 0) $this->saveBadge($user->id, '5');
        }

        // Logro 6: Imparable (Reto completado al 100%)
        if (!in_array('6', $unlocked)) {
            $completed = $challenges->filter(fn($c) => $c->total_days > 0 && ($c->current_days >= $c->total_days));
            if ($completed->count() > 0) $this->saveBadge($user->id, '6');
        }

        // Logro 8: Maratonista (Reto de 100 días o más)
        if (!in_array('8', $unlocked) && $challenges->where('total_days', '>=', 100)->count() > 0) {
            $this->saveBadge($user->id, '8');
        }
    }

    private function saveBadge($userId, $badgeId)
    {
        UserBadge::firstOrCreate([
            'user_id' => $userId, 
            'badge_id' => (string)$badgeId
        ], ['unlocked_at' => now()]);
    }
}