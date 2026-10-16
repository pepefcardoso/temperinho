<?php

namespace App\Services\Post;

use App\Models\Post;
use App\Notifications\PostApproved;

class ApprovePost
{
    public function approve(Post $post): Post
    {
        $post->update([
            'status' => Post::STATUS_PUBLISHED,
            'rejection_reason' => null,
        ]);

        $post->user->notify(new PostApproved($post));

        return $post;
    }
}
