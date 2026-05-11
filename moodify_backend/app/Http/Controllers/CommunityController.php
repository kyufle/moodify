<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommunityController extends Controller
{
    // GET /community/following-moods
    // Returns the people I follow + their latest mood
    public function followingMoods(Request $request)
    {
        $userId = $request->user()->id;

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
                    'mood_date'  => $latest?->date,
                ];
            });

        return response()->json($results);
    }

    // GET /community/suggested
    // Returns up to 10 users not yet followed (public profiles)
    public function suggestedUsers(Request $request)
    {
        $userId = $request->user()->id;

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

    // GET /community/posts
    // Returns community posts ordered by newest, with user info + likes
    public function getPosts(Request $request)
    {
        $userId  = $request->user()->id;
        $perPage = 20;
        $page    = max(1, (int) $request->query('page', 1));
        $offset  = ($page - 1) * $perPage;

        $posts = DB::table('publications')
            ->join('users', 'publications.user_id', '=', 'users.id')
            ->select(
                'publications.id',
                'publications.title',
                'publications.text_publications as content',
                'publications.date',
                'publications.user_id',
                'users.name as user_name',
                'users.username',
                'users.image_id'
            )
            ->orderByDesc('publications.date')
            ->offset($offset)
            ->limit($perPage)
            ->get();

        $result = $posts->map(function ($post) use ($userId) {
            $likesCount = DB::table('post_likes')
                ->where('publication_id', $post->id)
                ->count();

            $isLiked = DB::table('post_likes')
                ->where('publication_id', $post->id)
                ->where('user_id', $userId)
                ->exists();

            return array_merge((array) $post, [
                'likes_count' => $likesCount,
                'is_liked'    => $isLiked,
            ]);
        });

        return response()->json($result);
    }

    // POST /community/posts
    // Creates a new publication
    public function createPost(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $id = DB::table('publications')->insertGetId([
            'title'              => '',
            'text_publications'  => $request->content,
            'date'               => now(),
            'user_id'            => $request->user()->id,
        ]);

        $post = DB::table('publications')
            ->join('users', 'publications.user_id', '=', 'users.id')
            ->where('publications.id', $id)
            ->select(
                'publications.id',
                'publications.title',
                'publications.text_publications as content',
                'publications.date',
                'publications.user_id',
                'users.name as user_name',
                'users.username',
                'users.image_id'
            )
            ->first();

        return response()->json(array_merge((array) $post, [
            'likes_count' => 0,
            'is_liked'    => false,
        ]), 201);
    }

    // POST /community/posts/{id}/like
    // Toggles like on a post
    public function likePost(Request $request, $id)
    {
        $userId = $request->user()->id;

        $exists = DB::table('post_likes')
            ->where('publication_id', $id)
            ->where('user_id', $userId)
            ->exists();

        if ($exists) {
            DB::table('post_likes')
                ->where('publication_id', $id)
                ->where('user_id', $userId)
                ->delete();
            $liked = false;
        } else {
            DB::table('post_likes')->insert([
                'publication_id' => $id,
                'user_id'        => $userId,
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);
            $liked = true;
        }

        $count = DB::table('post_likes')->where('publication_id', $id)->count();

        return response()->json(['liked' => $liked, 'likes_count' => $count]);
    }
}
