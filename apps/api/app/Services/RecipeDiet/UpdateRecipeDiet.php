<?php

namespace App\Services\RecipeDiet;

use App\Models\RecipeDiet;
use Illuminate\Support\Facades\Cache;

class UpdateRecipeDiet
{
    public function update(RecipeDiet $diet, array $data): RecipeDiet
    {
        $diet->update($data);

        Cache::tags('recipe_diets')->flush();

        return $diet;
    }
}
