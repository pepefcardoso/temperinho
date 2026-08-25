<?php

namespace App\Services\Comment;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class UpdateComment
{
    public function execute(Comment $comment, User $user, array $data): Comment
    {
        $comment->update($data);

        $this->flushCommentableCache($comment->commentable);

        return $comment;
    }

    private function flushCommentableCache(Model $commentable): void
    {
        $type = $commentable->getMorphClass();
        $tags = ["comments:{$type}:{$commentable->id}", 'comments'];
        Cache::tags($tags)->flush();
    }
}
