<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
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
    public function updateTheme(Request $request)
    {
        $request->validate([
            'bgName' => 'nullable|string',
            'myMsgColor' => 'required|string|max:7',
            'otherMsgColor' => 'required|string|max:7',
            'textColorOwn' => 'required|string|max:7',
            'textColorOther' => 'required|string|max:7',
        ]);
        $user = $request->user();

        $user->update([
            'bg_image' => $request->bgName,
            'my_msg_color' => $request->myMsgColor,
            'other_msg_color' => $request->otherMsgColor,
            'text_colorOwn' => $request->textColorOwn,
            'text_colorOther' => $request->textColorOther,
        ]);

        return response()->json(['status' => 'success', 'theme' => $user]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'     => 'required|string|max:255',
            'username' => 'required|string|max:50|alpha_dash|unique:users,username,' . $user->id,
            'email'    => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name'     => $request->name,
            'username' => $request->username,
            'email'    => $request->email,
        ]);

        return response()->json(['status' => 'success', 'user' => $user]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|min:8',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status'  => 'error',
                'message' => 'La contraseña actual no es correcta.',
            ], 422);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json(['status' => 'success']);
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'is_public'             => 'nullable|boolean',
            'show_in_community'     => 'nullable|boolean',
            'notifications_enabled' => 'nullable|boolean',
            'app_bg'                => 'nullable|string|max:50',
            'language'              => 'nullable|string|max:5',
        ]);

        $user = $request->user();

        $user->update($request->only([
            'is_public',
            'show_in_community',
            'notifications_enabled',
            'app_bg',
            'language',
        ]));

        return response()->json(['status' => 'success', 'user' => $user]);
    }

}