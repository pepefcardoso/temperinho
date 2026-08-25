<?php

namespace App\Services\Recipe;

use App\Models\Recipe;
use Illuminate\Support\Facades\Cache;

class ShowRecipe
{
    public function show(Recipe $recipe)
    {
        $detailedRecipe = Cache::remember("recipe_model.{$recipe->id}", now()->addHour(), function () use ($recipe) {
            $recipe->load([
                'diets',
                'category',
                'steps',
                'ingredients.unit',
                'image',
                'user.image'
            ]);
            $recipe->loadAvg('ratings', 'rating');
            $recipe->loadCount('ratings');

            return $recipe;
        });

        if ($userId = auth('sanctum')->id()) {
            $detailedRecipe->loadExists([
                'favoritedByUsers as is_favorited' => fn($q) => $q->where('user_id', $userId)
            ]);
        }

        return $detailedRecipe;
    }
}
