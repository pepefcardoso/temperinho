<?php

namespace App\Services\Comment;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class DeleteComment
{
    public function execute(Comment $comment, User $user): void
    {
        $commentable = $comment->commentable;
        $comment->delete();

        $this->flushCommentableCache($commentable);
    }

    private function flushCommentableCache(Model $commentable): void
    {
        $type = $commentable->getMorphClass();
        $tags = ["comments:{$type}:{$commentable->id}", 'comments'];
        Cache::tags($tags)->flush();
    }
}
