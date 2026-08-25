<?php

namespace App\Services\Comment;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class CreateComment
{
    public function execute(Model $commentable, User $user, array $data): Comment
    {
        $comment = $commentable->comments()->create([
            'user_id' => $user->id,
            'content' => $data['content'],
        ]);

        $this->flushCommentableCache($commentable);

        return $comment;
    }

    private function flushCommentableCache(Model $commentable): void
    {
        $type = $commentable->getMorphClass();
        $tags = ["comments:{$type}:{$commentable->id}", 'comments'];
        Cache::tags($tags)->flush();
    }
}
