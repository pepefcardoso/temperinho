<?php

namespace Tests\Feature\Recipe;

use App\Models\Recipe;
use App\Models\RecipeCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class RecipePublicTest extends TestCase
{
    use RefreshDatabase, RecipeTestSetup;

    #[Test]
    public function public_user_can_list_recipes(): void
    {
        Recipe::factory(3)->create();

        $this->getJson('/api/recipes')
            ->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => ['*' => ['id', 'title', 'image', 'category']],
                'links',
                'meta'
            ]);
    }

    #[Test]
    public function recipes_can_be_filtered_by_title_and_category(): void
    {
        $category1 = RecipeCategory::factory()->create();
        $category2 = RecipeCategory::factory()->create();

        Recipe::factory()->create(['title' => 'Sopa de Legumes', 'category_id' => $category1->id]);
        Recipe::factory()->create(['title' => 'Bolo de Chocolate', 'category_id' => $category2->id]);

        $this->getJson('/api/recipes?title=Sopa')->assertJsonCount(1, 'data');
        $this->getJson('/api/recipes?category_id=' . $category2->id)->assertJsonCount(1, 'data');
    }

    #[Test]
    public function public_user_can_view_a_single_recipe(): void
    {
        $recipe = Recipe::factory()->hasIngredients(3)->hasSteps(3)->create();

        $this->getJson('/api/recipes/' . $recipe->id)
            ->assertOk()
            ->assertJsonPath('data.id', $recipe->id)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'title',
                    'description',
                    'author',
                    'category',
                    'diets',
                    'ingredients',
                    'steps'
                ]
            ]);
    }

    #[Test]
    public function returns_404_if_recipe_not_found(): void
    {
        $this->getJson('/api/recipes/999')->assertNotFound();
    }
}
