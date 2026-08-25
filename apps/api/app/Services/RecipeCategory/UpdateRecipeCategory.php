<?php

namespace App\Services\RecipeCategory;

use App\Models\RecipeCategory;
use Illuminate\Support\Facades\Cache;

class UpdateRecipeCategory
{
    public function update(RecipeCategory $category, array $data): RecipeCategory
    {
        $category->update($data);

        Cache::tags('recipe_categories')->flush();

        return $category;
    }
}
