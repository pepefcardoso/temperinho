<?php

namespace App\Policies;

use App\Models\RecipeDiet;
use App\Models\User;

class RecipeDietPolicy
{
    public function viewAny(?User $user)
    {
        return true;
    }

    public function view(?User $user, RecipeDiet $recipeDiet)
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isInternal();
    }

    public function update(User $user, RecipeDiet $recipeDiet): bool
    {
        return $user->isInternal();
    }

    public function delete(User $user, RecipeDiet $recipeDiet): bool
    {
        return $user->isInternal();
    }
}
