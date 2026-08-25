<?php

namespace App\Services\RecipeUnit;

use App\Models\RecipeUnit;
use Illuminate\Support\Facades\Cache;

class UpdateRecipeUnit
{
    public function update(RecipeUnit $unit, array $data): RecipeUnit
    {
        $unit->update($data);

        Cache::tags('recipe_units')->flush();

        return $unit;
    }
}
