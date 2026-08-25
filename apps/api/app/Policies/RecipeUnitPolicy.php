<?php

namespace App\Policies;

use App\Models\RecipeUnit;
use App\Models\User;

class RecipeUnitPolicy
{
    public function viewAny(?User $user)
    {
        return true;
    }

    public function view(?User $user, RecipeUnit $recipeUnit)
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isInternal();
    }

    public function update(User $user, RecipeUnit $recipeUnit): bool
    {
        return $user->isInternal();
    }

    public function delete(User $user, RecipeUnit $recipeUnit): bool
    {
        return $user->isInternal();
    }
}
