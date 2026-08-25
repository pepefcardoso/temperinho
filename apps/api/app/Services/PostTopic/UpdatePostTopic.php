<?php

namespace App\Services\PostTopic;

use App\Models\PostTopic;
use Illuminate\Support\Facades\Cache;

class UpdatePostTopic
{
    public function update(PostTopic $topic, array $data): PostTopic
    {
        $topic->update($data);

        Cache::tags('post_topics')->flush();

        return $topic;
    }
}
