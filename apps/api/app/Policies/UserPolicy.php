<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{

    public function viewAny(?User $user)
    {
        return $user->isInternal();
    }

    public function view(User $authUser, User $targetUser): bool
    {
        return $authUser->isInternal() || $authUser->id === $targetUser->id;
    }

    public function create(?User $user): bool
    {
        return true;
    }

    public function update(User $authUser, User $targetUser): bool
    {
        return $authUser->isInternal() || $authUser->id === $targetUser->id;
    }

    public function delete(User $authUser, User $targetUser): bool
    {
        return $authUser->isInternal() || $authUser->id === $targetUser->id;
    }

    public function updateRole(User $authUser, User $targetUser): bool
    {
        return $authUser->isInternal();
    }

    public function toggleFavoritePost(User $authUser, ?User $targetUser = null): bool
    {
        $targetId = $targetUser?->id ?? $authUser->id;
        return $authUser->isInternal() || $authUser->id === $targetId;
    }

    public function toggleFavoriteRecipe(User $authUser, ?User $targetUser = null): bool
    {
        $targetId = $targetUser?->id ?? $authUser->id;
        return $authUser->isInternal() || $authUser->id === $targetId;
    }
}
