<?php

namespace App\Policies;

use App\Models\RecipeIngredient;
use App\Models\User;

class RecipeIngredientPolicy
{
    public function viewAny(?User $user)
    {
        return true;
    }

    public function view(?User $user, RecipeIngredient $recipeIngredient)
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, RecipeIngredient $recipeIngredient): bool
    {
        return $user->isInternal() || $user->id === $recipeIngredient->recipe->user_id;
    }

    public function delete(User $user, RecipeIngredient $recipeIngredient): bool
    {
        return $user->isInternal() || $user->id === $recipeIngredient->recipe->user_id;
    }
}
