<?php
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\MoodRegisterController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CommunityController;
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
    Route::get('/get-today-timeline', [UserController::class, 'actionAlert']);
    Route::get('/get-monthly-stats', [MoodRegisterController::class, 'getMonthlyStats']);
    Route::get('/getDashboardInfo',[MoodRegisterController::class, 'getDashboardInfo']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/chat', [ChatController::class, 'store']);
    Route::get('/conversations', [ChatController::class, 'index']);
    Route::post('/messages', [ChatController::class, 'storeP2P']);
    Route::get('/messages/user/{recipientId}', [ChatController::class, 'getMessagesByUserId']);
    Route::post('/messages/read/{senderId}', [ChatController::class, 'markAsRead']);
    Route::get('/users/search', [ChatController::class, 'searchUsers']);
    Route::post('/users/follow', [ChatController::class, 'toggleFollow']);
    Route::post('/chat-themes', [UserController::class, 'updateTheme']);
    Route::post('/update-profile', [UserController::class, 'updateProfile']);
    Route::post('/change-password', [UserController::class, 'changePassword']);
    Route::post('/update-settings', [UserController::class, 'updateSettings']);
    Route::get('/community/following-moods', [CommunityController::class, 'followingMoods']);
    Route::get('/community/suggested', [CommunityController::class, 'suggestedUsers']);
    Route::get('/community/posts', [CommunityController::class, 'getPosts']);
    Route::post('/community/posts', [CommunityController::class, 'createPost']);
    Route::post('/community/posts/{id}/like', [CommunityController::class, 'likePost']);

    Route::get('/habits/weekly-status', [HabitController::class, 'getWeeklyStatus']);
    Route::get('/habits/today', [HabitController::class, 'getTodayHabits']);
    Route::post('/habits', [HabitController::class, 'store']);
    Route::post('/habits/toggle/{id}', [HabitController::class, 'toggleHabit']);
    Route::delete('/habits/{id}', [HabitController::class, 'destroy']);

    Route::get('/challenges', [ChallengeController::class, 'index']);
    Route::post('/challenges', [ChallengeController::class, 'store']);
    Route::put('/challenges/{id}', [ChallengeController::class, 'update']);
    Route::delete('/challenges/{id}', [ChallengeController::class, 'destroy']);

    Route::post('/challenges/{id}/mark-day', [ChallengeController::class, 'markDay']);

    Route::get('/achievements', [AchievementController::class, 'getAchievements']);
});