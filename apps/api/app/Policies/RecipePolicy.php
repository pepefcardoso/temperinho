<?php

namespace App\Policies;

use App\Models\Recipe;
use App\Models\User;

class RecipePolicy
{
    public function viewAny(?User $user)
    {
        return true;
    }

    public function view(?User $user, Recipe $recipe)
    {
        return true;
    }

    public function viewFavorites(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Recipe $recipe): bool
    {
        return $user->isInternal() || $user->id === $recipe->user_id;
    }

    public function delete(User $user, Recipe $recipe): bool
    {
        return $user->isInternal() || $user->id === $recipe->user_id;
    }
}
