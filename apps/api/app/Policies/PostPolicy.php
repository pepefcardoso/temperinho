<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
class PostPolicy
{
    public function viewAny(?User $user)
    {
        return true;
    }

    public function view(?User $user, Post $post)
    {
        return true;
    }

    public function viewFavorites(User $user)
    {
        return true;
    }

    public function create(User $user): bool
    {
        if ($user->isInternal()) {
            return true;
        }

        return $user->company?->subscriptions()->whereIsActive()->exists() ?? false;
    }

    public function update(User $user, Post $post): bool
    {
        return $user->isInternal() || $user->id === $post->user_id;
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->isInternal() || $user->id === $post->user_id;
    }
}
