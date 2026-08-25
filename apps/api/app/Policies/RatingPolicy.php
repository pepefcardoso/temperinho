<?php

namespace App\Policies;

use App\Models\Rating;
use App\Models\User;

class RatingPolicy
{
    public function viewAny(?User $user)
    {
        return true;
    }

    public function view(?User $user, ?Rating $rating = null)
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Rating $rating): bool
    {
        return $user->isInternal() || $user->id === $rating->user_id;
    }

    public function delete(User $user, Rating $rating): bool
    {
        return $user->isInternal() || $user->id === $rating->user_id;
    }
}
