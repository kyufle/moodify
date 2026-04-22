<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class StressController extends Controller
{
    public function getStatus(Request $request)
    {
        try {
            $user = $request->user();
            
            $lastLog = DB::table('stress_tests')
                ->where('user_id', $user->id)
                ->latest('created_at')
                ->first();

            if ($lastLog) {
                $isToday = Carbon::parse($lastLog->created_at)->isToday();
                
                if ($isToday) {
                    $lastLog->breakdown = json_decode($lastLog->breakdown);
                    return response()->json(['exists' => true, 'data' => $lastLog]);
                }
            }

            return response()->json(['exists' => false]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            DB::table('stress_tests')->insert([
                'user_id' => $request->user()->id,
                'total_score' => $request->total_score,
                'breakdown' => json_encode($request->breakdown),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json(['status' => 'success'], 201);
        } catch (\Exception $e) {
            Log::error("ERROR EN STRESS: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}