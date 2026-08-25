<?php

namespace Database\Seeders;

use App\Models\RecipeIngredient;
use Illuminate\Database\Seeder;

class RecipeIngredientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        RecipeIngredient::factory(10)->create();
    }
}
