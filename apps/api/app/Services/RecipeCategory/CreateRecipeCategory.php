<?php

namespace App\Services\RecipeCategory;

use App\Models\RecipeCategory;
use Illuminate\Support\Facades\Cache;

class CreateRecipeCategory
{
    public function create(array $data): RecipeCategory
    {
        $category = RecipeCategory::create($data);

        Cache::tags('recipe_categories')->flush();

        return $category;
    }
}
