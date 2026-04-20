<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'settings' => $user ? $user->settings : [
                'language' => 'Spanish',
                'theme' => 'light',
                'notifications' => true,
            ]
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'language' => 'sometimes|string',
            'theme' => 'sometimes|string',
            'notifications' => 'sometimes|boolean',
        ]);

        $user = $request->user();
        $settings = $user->settings ?? [];
        $user->settings = array_merge($settings, $validated);
        $user->save();

        return response()->json([
            'settings' => $user ? $user->settings : null
        ]);
    }
}
