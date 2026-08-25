<?php

namespace App\Policies;

use App\Models\Image;
use App\Models\User;

class ImagePolicy
{
    public function viewAny(User $user)
    {
        return $user->isInternal();
    }

    public function view(User $user, Image $image)
    {
        return $user->isInternal() || $user->id === $image->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Image $image): bool
    {
        return $user->isInternal() || $user->id === $image->user_id;
    }

    public function delete(User $user, Image $image): bool
    {
        return $user->isInternal() || $user->id === $image->user_id;
    }
}
