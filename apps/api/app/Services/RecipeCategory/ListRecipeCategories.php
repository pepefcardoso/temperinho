<?php

namespace App\Services\RecipeCategory;

use App\Models\RecipeCategory;
use App\Services\Concerns\ListTaxonomyService;

class ListRecipeCategories
{
    use ListTaxonomyService;

    protected function getModelClass(): string
    {
        return RecipeCategory::class;
    }

    protected function getCacheTag(): string
    {
        return 'recipe_categories';
    }
}
