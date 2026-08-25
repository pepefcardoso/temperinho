<?php

namespace App\Services\Post;

use App\Models\Post;
use Illuminate\Support\Facades\Cache;

class ShowPost
{
    public function show(Post $post)
    {
        $detailedPost = Cache::remember("post_model.{$post->id}", now()->addHour(), function () use ($post) {
            $post->load(['category', 'topics', 'image', 'user.image']);
            $post->loadAvg('ratings', 'rating');
            $post->loadCount('ratings');

            return $post;
        });

        if ($userId = auth('sanctum')->id()) {
            $detailedPost->loadExists(['favoritedByUsers as is_favorited' => fn($q) => $q->where('user_id', $userId)]);
        }

        return $detailedPost;
    }
}
