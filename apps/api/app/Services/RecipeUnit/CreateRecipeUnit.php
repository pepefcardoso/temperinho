<?php

namespace App\Services\RecipeUnit;

use App\Models\RecipeUnit;
use Illuminate\Support\Facades\Cache;

class CreateRecipeUnit
{
    public function create(array $data): RecipeUnit
    {
        $unit = RecipeUnit::create($data);

        Cache::tags('recipe_units')->flush();

        return $unit;
    }
}
