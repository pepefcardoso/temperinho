<?php

namespace App\Services\User;

use App\Models\User;

class ToggleFavoriteRecipe
{
    public function execute(User $user, mixed $recipeId): array
    {
        return $user->favoriteRecipes()->toggle($recipeId);
    }
}
