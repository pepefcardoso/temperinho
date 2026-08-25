<?php

namespace App\Services\PostTopic;

use App\Models\PostTopic;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class DeletePostTopic
{
    public function delete(PostTopic $topic): void
    {
        if ($topic->posts()->exists()) {
            throw ValidationException::withMessages(['topic' => 'This topic is in use and cannot be deleted.']);
        }

        $topic->delete();

        Cache::tags('post_topics')->flush();
    }
}
