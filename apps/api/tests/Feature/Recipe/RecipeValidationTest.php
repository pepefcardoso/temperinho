<?php

namespace Tests\Feature\Recipe;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\DataProvider;

class RecipeValidationTest extends TestCase
{
    use RefreshDatabase, RecipeTestSetup;

    #[Test]
    #[DataProvider('invalidRecipeDataProvider')]
    public function create_recipe_fails_with_invalid_data(array $invalidData, string|array $field): void
    {
        Sanctum::actingAs($this->user);
        $recipeData = $this->getValidRecipeData();

        $this->postJson('/api/recipes', array_merge($recipeData, $invalidData))
            ->assertUnprocessable()
            ->assertJsonValidationErrors($field);
    }

    public static function invalidRecipeDataProvider(): array
    {
        return [
            'title is required' => [['title' => ''], 'title'],
            'description is required' => [['description' => ''], 'description'],
            'diets must be an array' => [['diets' => 'invalid'], 'diets'],
            'diet ID must exist' => [['diets' => [999]], 'diets.0'],
            'steps are required' => [['steps' => []], 'steps'],
            'step description is required' => [['steps' => [['description' => '']]], 'steps.0.description'],
            'image is required on create' => [['image' => null], 'image'],
        ];
    }
}
