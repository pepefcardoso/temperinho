<?php

namespace App\Services\RecipeDiet;

use App\Models\RecipeDiet;
use Illuminate\Support\Facades\Cache;

class CreateRecipeDiet
{
    public function create(array $data): RecipeDiet
    {
        $diet = RecipeDiet::create($data);

        Cache::tags('recipe_diets')->flush();

        return $diet;
    }
}
