<?php

namespace App\Policies;

use App\Models\PostTopic;
use App\Models\User;

class PostTopicPolicy
{
    public function viewAny(?User $user)
    {
        return true;
    }

    public function view(?User $user, PostTopic $PostTopic)
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isInternal();
    }

    public function update(User $user, PostTopic $PostTopic): bool
    {
        return $user->isInternal();
    }

    public function delete(User $user, PostTopic $PostTopic): bool
    {
        return $user->isInternal();
    }
}
