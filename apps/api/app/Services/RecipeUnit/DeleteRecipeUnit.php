<?php

namespace App\Services\RecipeUnit;

use App\Models\RecipeUnit;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class DeleteRecipeUnit
{
    public function delete(RecipeUnit $unit): void
    {
        if ($unit->ingredients()->exists()) {
            throw ValidationException::withMessages([
                'unit' => 'This unit cannot be deleted because it is associated with one or more ingredients.',
            ]);
        }

        $unit->delete();

        Cache::tags('recipe_units')->flush();
    }
}
