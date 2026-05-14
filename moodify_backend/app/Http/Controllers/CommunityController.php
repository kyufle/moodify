<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class CommunityController extends Controller
{
    public function followingMoods(Request $request)
    {
        $userId = Auth::id();
        $followingIds = DB::table('followed_follower')
            ->where('follower_id', $userId)
            ->pluck('followed_id');

        $results = User::whereIn('id', $followingIds)
            ->select('id', 'name', 'username', 'image_id')
            ->get()
            ->map(function ($user) {
                $latest = DB::table('mood_registers')
                    ->where('user_id', $user->id)
                    ->orderByDesc('date')
                    ->first(['mood', 'date']);

                return [
                    'id'         => $user->id,
                    'name'       => $user->name,
                    'username'   => $user->username,
                    'image_id'   => $user->image_id,
                    'mood'       => $latest?->mood,
                    'mood_date'  => $latest?->date ? Carbon::parse($latest->date)->toIso8601String() : null,
                ];
            });
        return response()->json($results);
    }

    public function suggestedUsers(Request $request)
    {
        $userId = Auth::id();
        $followingIds = DB::table('followed_follower')
            ->where('follower_id', $userId)
            ->pluck('followed_id')
            ->toArray();

        $excluded = array_merge($followingIds, [$userId]);
        $users = User::whereNotIn('id', $excluded)
            ->where('is_public', true)
            ->select('id', 'name', 'username', 'image_id', 'streak', 'points')
            ->orderByDesc('streak')
            ->limit(10)
            ->get();
        return response()->json($users);
    }

    public function getPosts(Request $request)
    {
        try {
            $userId = Auth::id();

            $followingIds = [];
            if (Schema::hasTable('followed_follower')) {
                $followingIds = DB::table('followed_follower')
                    ->where('follower_id', $userId)
                    ->pluck('followed_id')
                    ->toArray();
            }

            $blockedIds = [];
            if (Schema::hasTable('user_blocks')) {
                $blockedIds = DB::table('user_blocks')
                    ->where('blocker_id', $userId)
                    ->pluck('blocked_id')
                    ->toArray();
            }

            $postsQuery = DB::table('publications')
                ->join('users', 'publications.user_id', '=', 'users.id');

            $allowedUserIds = array_merge($followingIds, [$userId]);
            $postsQuery->whereIn('publications.user_id', $allowedUserIds);

            if (!empty($blockedIds)) {
                $postsQuery->whereNotIn('publications.user_id', $blockedIds);
            }

            $posts = $postsQuery->select(
                    'publications.id',
                    'publications.text_publications as content',
                    'publications.date',
                    'publications.user_id',
                    'users.name as user_name',
                    'users.username',
                    'users.image_id'
                )
                ->orderByDesc('publications.date')
                ->get();

            $result = $posts->map(function ($post) use ($userId, $followingIds) {
                $likesCount = DB::table('post_likes')->where('publication_id', $post->id)->count();
                
                $isLiked = DB::table('post_likes')
                    ->where('publication_id', $post->id)
                    ->where('user_id', $userId)
                    ->exists();

                $commentsCount = DB::table('comments')->where('publication_id', $post->id)->count();

                $isFollowing = in_array($post->user_id, $followingIds);

                return array_merge((array) $post, [
                    'likes_count'    => $likesCount,
                    'is_liked'       => $isLiked,
                    'comments_count' => $commentsCount,
                    'is_following'   => $isFollowing,
                    'date'           => Carbon::parse($post->date)->toIso8601String(), 
                ]);
            });
            
            return response()->json($result);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en el servidor: ' . $e->getMessage()], 500);
        }
    }

    public function createPost(Request $request)
    {
        $request->validate(['content' => 'required|string|max:1000']);
        
        $now = Carbon::now();

        $id = DB::table('publications')->insertGetId([
            'title'             => '', 
            'text_publications' => $request->input('content'),
            'date'              => $now,
            'user_id'           => Auth::id(),
        ]);

        $post = DB::table('publications')
            ->join('users', 'publications.user_id', '=', 'users.id')
            ->where('publications.id', $id)
            ->select(
                'publications.id',
                'publications.text_publications as content',
                'publications.date',
                'publications.user_id',
                'users.name as user_name',
                'users.username',
                'users.image_id'
            )->first();

        $formattedDate = Carbon::parse($post->date)->toIso8601String();

        return response()->json(array_merge((array) $post, [
            'likes_count'    => 0,
            'is_liked'       => false,
            'comments_count' => 0,
            'is_following'   => false,
            'date'           => $formattedDate,
        ]), 201);
    }

    public function deletePost(Request $request, $id)
    {
        $userId = Auth::id();
        $postId = intval($id);
        $post = DB::table('publications')->where('id', $postId)->first();

        if (!$post || $post->user_id !== $userId) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        DB::table('post_likes')->where('publication_id', $postId)->delete();
        DB::table('comments')->where('publication_id', $postId)->delete();
        DB::table('publications')->where('id', $postId)->delete();

        return response()->json(['success' => true]);
    }

    public function likePost(Request $request, $id)
    {
        $userId = Auth::id();
        $postId = intval($id);
        
        $exists = DB::table('post_likes')
            ->where('publication_id', $postId)
            ->where('user_id', $userId)
            ->exists();

        if ($exists) {
            DB::table('post_likes')->where('publication_id', $postId)->where('user_id', $userId)->delete();
            $liked = false;
        } else {
            DB::table('post_likes')->insert([
                'publication_id' => $postId,
                'user_id'        => $userId,
                'created_at'     => Carbon::now(),
                'updated_at'     => Carbon::now(),
            ]);
            $liked = true;
        }

        $count = DB::table('post_likes')->where('publication_id', $postId)->count();
        return response()->json(['liked' => $liked, 'likes_count' => $count]);
    }

    public function storeComment(Request $request, $id)
    {
        $request->validate(['content' => 'required|string|max:500']);

        DB::table('comments')->insert([
            'publication_id' => intval($id),
            'user_id'        => Auth::id(),
            'text_comments'  => $request->input('content'),
            'parent_id'      => $request->input('parent_id'),
            'date'           => Carbon::now(),
        ]);

        return response()->json(['success' => true], 201);
    }

    public function getComments($id)
    {
        $comments = DB::table('comments')
            ->join('users', 'comments.user_id', '=', 'users.id')
            ->where('publication_id', intval($id))
            ->select(
                'comments.id',
                'comments.text_comments as content',
                'comments.date',
                'comments.parent_id',
                'users.name as user_name',
                'users.image_id'
            )
            ->orderBy('comments.date', 'asc')
            ->get()
            ->map(function($comment) {
                $comment->date = Carbon::parse($comment->date)->toIso8601String();
                return $comment;
            });

        return response()->json($comments);
    }

    public function deleteComment(Request $request, $id)
    {
        $userId = Auth::id();
        $comment = DB::table('comments')->where('id', intval($id))->first();

        if (!$comment || $comment->user_id !== $userId) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        DB::table('comments')->where('parent_id', $comment->id)->delete();
        DB::table('comments')->where('id', $comment->id)->delete();

        return response()->json(['success' => true]);
    }

    public function follow(Request $request, $id) {
        $userId = Auth::id();
        
        DB::table('followed_follower')->updateOrInsert(
            [
                'follower_id' => $userId,
                'followed_id' => $id
            ],
            [
                'created_at' => \Carbon\Carbon::now(),
                'updated_at' => \Carbon\Carbon::now()
            ]
        );
        
        return response()->json(['success' => true]);
    }

    public function unfollow(Request $request, $id) {
        DB::table('followed_follower')
            ->where('follower_id', Auth::id())
            ->where('followed_id', $id)
            ->delete();
        return response()->json(['success' => true]);
    }

    public function blockUser(Request $request, $id) {
        $userId = Auth::id();
        
        if (Schema::hasTable('user_blocks')) {
            DB::table('user_blocks')->insert([
                'blocker_id' => $userId,
                'blocked_id' => $id,
                'created_at' => Carbon::now()
            ]);
        }
        
        $this->unfollow($request, $id);
        return response()->json(['success' => true]);
    }
    public function getBlockedUsers()
{
    try {
        $userId = Auth::id();
        
        $blocked = DB::table('user_blocks')
            ->join('users', 'user_blocks.blocked_id', '=', 'users.id')
            ->where('user_blocks.blocker_id', $userId)
            ->select('users.id', 'users.name', 'users.username', 'users.image_id')
            ->get();

        return response()->json($blocked);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
public function unblockUser($id)
{
    try {
        $userId = Auth::id();
        
        $deleted = DB::table('user_blocks')
            ->where('blocker_id', $userId)
            ->where('blocked_id', $id)
            ->delete();

        return response()->json(['success' => true, 'deleted' => $deleted]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
  public function getAlerts()
    {
        try {
            $userId = Auth::id();

            $dismissed = DB::table('dismissed_alerts')
                ->where('user_id', $userId)
                ->get(['alert_type', 'reference_id']);

            $likes = DB::table('post_likes')
                ->join('publications', 'post_likes.publication_id', '=', 'publications.id')
                ->join('users', 'post_likes.user_id', '=', 'users.id')
                ->where('publications.user_id', $userId)
                ->where('post_likes.user_id', '!=', $userId)
                ->select('post_likes.id as id', 'post_likes.publication_id as publication_id', 'users.name as user_name', 'users.username', 'users.image_id as avatar', 'post_likes.created_at as date', DB::raw("'like' as type"))
                ->get();

            $comments = DB::table('comments')
                ->join('publications', 'comments.publication_id', '=', 'publications.id')
                ->join('users', 'comments.user_id', '=', 'users.id')
                ->where('publications.user_id', $userId)
                ->where('comments.user_id', '!=', $userId)
                ->select('comments.id as id', 'comments.publication_id as publication_id', 'users.name as user_name', 'users.username', 'users.image_id as avatar', 'comments.date as date', DB::raw("'comment' as type"))
                ->get();

            $follows = DB::table('followed_follower')
                ->join('users', 'followed_follower.follower_id', '=', 'users.id')
                ->where('followed_follower.followed_id', $userId)
                ->select(
                    'users.id as id', 
                    'users.name as user_name', 
                    'users.username', 
                    'users.image_id as avatar', 
                    'followed_follower.created_at as date',
                    DB::raw("'follow' as type")
                )
                ->get();

            $alerts = $likes->concat($comments)->concat($follows)
                ->reject(function ($alert) use ($dismissed) {
                    return $dismissed->where('alert_type', $alert->type)->where('reference_id', $alert->id)->count() > 0;
                })
                ->sortByDesc('date')
                ->values(); 

            return response()->json($alerts);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error: ' . $e->getMessage()], 500);
        }
    }
    public function dismissAlert(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'id' => 'required|integer'
        ]);

        DB::table('dismissed_alerts')->insert([
            'user_id' => Auth::id(),
            'alert_type' => $request->input('type'),
            'reference_id' => $request->input('id'),
            'created_at' => \Carbon\Carbon::now()
        ]);

        return response()->json(['success' => true]);
    }  
}