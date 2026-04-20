<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::get('/user/settings', [\App\Http\Controllers\SettingsController::class, 'show']);
    Route::post('/user/settings', [\App\Http\Controllers\SettingsController::class, 'update']);
    Route::get('/user/achievements', [\App\Http\Controllers\AchievementController::class, 'index']);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);