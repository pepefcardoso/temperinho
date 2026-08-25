<?php

namespace Database\Factories;

use App\Models\Recipe;
use App\Models\RecipeUnit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RecipeIngredient>
 */
class RecipeIngredientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'recipe_id' => Recipe::factory(),
            'unit_id' => RecipeUnit::factory(),
            'name' => fake()->word(),
            'quantity' => fake()->randomFloat(2, 0.1, 500),
        ];
    }
}
