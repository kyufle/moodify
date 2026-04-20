<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AchievementController extends Controller
{
    public function index(Request $request)
    {
        // Dummy data since DB is failing on user's machine locally
        return response()->json([
            'achievements' => [
                ['id' => '1', 'name' => 'Dormir 8h', 'icon' => 'moon', 'color' => '#8B5CF6'],
                ['id' => '2', 'name' => 'Racha 7d', 'icon' => 'zap', 'color' => '#F59E0B'],
                ['id' => '3', 'name' => 'Zen', 'icon' => 'heart', 'color' => '#EF4444'],
                ['id' => '4', 'name' => 'Guardián', 'icon' => 'shield', 'color' => '#10B981']
            ]
        ]);
    }
}
