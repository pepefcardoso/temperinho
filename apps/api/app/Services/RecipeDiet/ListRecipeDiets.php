<?php

namespace App\Services\RecipeDiet;

use App\Models\RecipeDiet;
use App\Services\Concerns\ListTaxonomyService;

class ListRecipeDiets
{
    use ListTaxonomyService;

    protected function getModelClass(): string
    {
        return RecipeDiet::class;
    }

    protected function getCacheTag(): string
    {
        return 'recipe_diets';
    }
}
