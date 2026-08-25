<?php

namespace App\Services\RecipeCategory;

use App\Models\RecipeCategory;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class DeleteRecipeCategory
{
    public function delete(RecipeCategory $category): void
    {
        if ($category->recipes()->exists()) {
            throw ValidationException::withMessages([
                'category' => 'This category cannot be deleted because it is associated with recipes.',
            ]);
        }

        $category->delete();

        Cache::tags('recipe_categories')->flush();
    }
}
