<?php

namespace App\Services\RecipeUnit;

use App\Models\RecipeUnit;
use App\Services\Concerns\ListTaxonomyService;

class ListRecipeUnits
{
    use ListTaxonomyService;

    protected function getModelClass(): string
    {
        return RecipeUnit::class;
    }

    protected function getCacheTag(): string
    {
        return 'recipe_units';
    }
}
