<?php

namespace App\Services\Post;

use App\Models\Post;
use App\Notifications\PostRejected;

class RejectPost
{
    public function reject(Post $post, string $reason): Post
    {
        $post->update([
            'status' => Post::STATUS_REJECTED,
            'rejection_reason' => $reason,
        ]);

        $post->user->notify(new PostRejected($post));

        return $post;
    }
}
