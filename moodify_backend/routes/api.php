<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MoodRegisterController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/streakRegister', [UserController::class, 'streakRegister'])->middleware('auth:sanctum');
Route::post('/actionAlert',[UserController::class, 'actionAlert'])->middleware('auth:sanctum');
Route::post('/saveSleepLog',[UserController::class, 'saveSleepLog'])->middleware('auth:sanctum');
Route::post('/fillInHours',[UserController::class, 'fillInHours'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/getStatus', [App\Http\Controllers\StressController::class, 'getStatus']);
    Route::post('/store', [App\Http\Controllers\StressController::class, 'store']);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/save-mood', [MoodRegisterController::class, 'saveMood']);
    Route::get('/get-mood-calendar', [MoodRegisterController::class, 'getMoodCalendar']);
    Route::get('/get-today-timeline', [MoodRegisterController::class, 'getTodayTimeline']);
    Route::get('/get-monthly-stats', [MoodRegisterController::class, 'getMonthlyStats']);
    Route::get('/getDashboardInfo',[MoodRegisterController::class, 'getDashboardInfo']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/chat', [ChatController::class, 'store']);
});
