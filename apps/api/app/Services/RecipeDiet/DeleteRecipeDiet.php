<?php

namespace App\Services\RecipeDiet;

use App\Models\RecipeDiet;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class DeleteRecipeDiet
{
    public function delete(RecipeDiet $diet): void
    {
        if ($diet->recipes()->exists()) {
            throw ValidationException::withMessages([
                'diet' => 'This diet cannot be deleted because it is associated with recipes.',
            ]);
        }

        $diet->delete();

        Cache::tags('recipe_diets')->flush();
    }
}
