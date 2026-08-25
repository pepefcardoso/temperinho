<?php

namespace App\Services\User;

use App\Models\User;

class ToggleFavoritePost
{
    public function execute(User $user, mixed $postId): array
    {
        return $user->favoritePosts()->toggle($postId);
    }
}
