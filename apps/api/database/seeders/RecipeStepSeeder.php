<?php

namespace Database\Seeders;

use App\Models\RecipeStep;
use Illuminate\Database\Seeder;

class RecipeStepSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        RecipeStep::factory(10)->create();
    }
}
