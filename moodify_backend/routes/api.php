<?php
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\MoodRegisterController;
use App\Http\Controllers\StaffAnnouncementController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\StressController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas Públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas Protegidas
Route::middleware('auth:sanctum')->group(function () {
    
    // Usuario y Perfil
    Route::get('/user', function (Request $request) { return $request->user(); });
    Route::post('/streakRegister', [UserController::class, 'streakRegister']);
    Route::post('/actionAlert', [UserController::class, 'actionAlert']);
    Route::post('/saveSleepLog', [UserController::class, 'saveSleepLog']);
    Route::get('/averageSleep', [UserController::class, 'getMonthlySleepAverage']);
    Route::post('/fillInHours', [UserController::class, 'fillInHours']);
    Route::post('/update-profile', [UserController::class, 'updateProfile']);
    Route::post('/change-password', [UserController::class, 'changePassword']);
    Route::post('/update-settings', [UserController::class, 'updateSettings']);
    Route::post('/profile/update', [ProfileController::class, 'update']);
    Route::get('/achievements', [AchievementController::class, 'getAchievements']);

    // Estrés y Estado
    Route::get('/getStatus', [StressController::class, 'getStatus']);
    Route::post('/store', [StressController::class, 'store']);
    Route::get('/stressSummary', [StressController::class, 'getMonthlyDominantEmotion']);

    // Estados de Ánimo (Moods)
    Route::post('/save-mood', [MoodRegisterController::class, 'saveMood']);
    Route::get('/get-mood-calendar', [MoodRegisterController::class, 'getMoodCalendar']);
    Route::get('/get-today-timeline', [UserController::class, 'actionAlert']);
    Route::get('/get-monthly-stats', [MoodRegisterController::class, 'getMonthlyStats']);
    Route::get('/getDashboardInfo', [MoodRegisterController::class, 'getDashboardInfo']);

    // Chat y Mensajería
    Route::post('/chat', [ChatController::class, 'store']);
    Route::get('/conversations', [ChatController::class, 'index']);
    Route::post('/messages', [ChatController::class, 'storeP2P']);
    Route::get('/messages/user/{recipientId}', [ChatController::class, 'getMessagesByUserId']);
    Route::post('/messages/read/{senderId}', [ChatController::class, 'markAsRead']);
    Route::get('/users/search', [ChatController::class, 'searchUsers']);
    Route::post('/chat-themes', [UserController::class, 'updateTheme']);

    // Comunidad (Social)
    Route::prefix('community')->group(function () {
        Route::get('/following-moods', [CommunityController::class, 'followingMoods']);
        Route::get('/suggested', [CommunityController::class, 'suggestedUsers']);
        
        // Posts
        Route::get('/posts', [CommunityController::class, 'getPosts']);
        Route::post('/posts', [CommunityController::class, 'createPost']);
        Route::delete('/posts/{id}', [CommunityController::class, 'deletePost']);
        Route::post('/posts/{id}/like', [CommunityController::class, 'likePost']);
        
        // Comentarios
        Route::post('/posts/{id}/comments', [CommunityController::class, 'storeComment']);
        Route::get('/posts/{id}/comments', [CommunityController::class, 'getComments']);
        Route::delete('/comments/{id}', [CommunityController::class, 'deleteComment']);

        // Interacción de Usuarios y Privacidad
        Route::post('/users/{id}/follow', [CommunityController::class, 'follow']);
        Route::post('/users/{id}/unfollow', [CommunityController::class, 'unfollow']);
        
        // --- RUTAS DE BLOQUEO (NUEVAS) ---
        Route::post('/users/{id}/block', [CommunityController::class, 'blockUser']);
        Route::get('/blocked-users', [CommunityController::class, 'getBlockedUsers']); // Para el listado en perfil
        Route::post('/users/{id}/unblock', [CommunityController::class, 'unblockUser']); // Para el botón desbloquear
    });

    // Hábitos
    Route::get('/habits/weekly-status', [HabitController::class, 'getWeeklyStatus']);
    Route::get('/habits/today', [HabitController::class, 'getTodayHabits']);
    Route::post('/habits', [HabitController::class, 'store']);
    Route::post('/habits/toggle/{id}', [HabitController::class, 'toggleHabit']);
    Route::delete('/habits/{id}', [HabitController::class, 'destroy']);

    // Retos (Challenges)
    Route::get('/challenges', [ChallengeController::class, 'index']);
    Route::post('/challenges', [ChallengeController::class, 'store']);
    Route::put('/challenges/{id}', [ChallengeController::class, 'update']);
    Route::delete('/challenges/{id}', [ChallengeController::class, 'destroy']);
    Route::post('/challenges/{id}/mark-day', [ChallengeController::class, 'markDay']);
    Route::post('community/users/{id}/unblock', [CommunityController::class, 'unblockUser']);
    Route::get('/user/alerts', [CommunityController::class, 'getAlerts']);
    Route::post('/user/alerts/dismiss', [CommunityController::class, 'dismissAlert']);

Route::get('/getAnnouncements', [StaffAnnouncementController::class, 'index']);
    Route::post('/storeAnnouncement', [StaffAnnouncementController::class, 'store']);
    Route::delete('/deleteAnnouncement/{id}', [StaffAnnouncementController::class, 'destroy']);

    });