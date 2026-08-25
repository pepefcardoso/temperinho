<?php

namespace App\Services\PostTopic;

use App\Models\PostTopic;
use Illuminate\Support\Facades\Cache;

class CreatePostTopic
{
    public function create(array $data): PostTopic
    {
        $topic = PostTopic::create($data);

        Cache::tags('post_topics')->flush();

        return $topic;
    }
}
