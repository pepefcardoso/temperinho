<?php

namespace Tests\Feature\Recipe;

use App\Models\Recipe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class RecipeManipulationTest extends TestCase
{
    use RefreshDatabase, RecipeTestSetup;

    #[Test]
    public function authenticated_user_can_create_a_recipe(): void
    {
        Sanctum::actingAs($this->user);
        Storage::fake('s3');
        $recipeData = $this->getValidRecipeData();

        $this->postJson('/api/recipes', $recipeData)
            ->assertCreated()
            ->assertJsonPath('data.title', $recipeData['title']);

        $this->assertDatabaseHas('recipes', ['title' => $recipeData['title']]);
        $this->assertDatabaseCount('recipe_steps', 2);
        $this->assertDatabaseCount('recipe_ingredients', 2);
        Storage::disk('s3')->assertExists(Recipe::first()->image->path);
    }

    #[Test]
    public function authorized_user_can_update_their_own_recipe(): void
    {
        $recipe = Recipe::factory()->for($this->user)->hasSteps(2)->hasIngredients(2)->create();
        Sanctum::actingAs($this->user);

        $updateData = ['title' => 'Novo Título'];
        $fullPayload = array_merge($this->getRecipeDataForUpdate($recipe), $updateData);

        $this->putJson('/api/recipes/' . $recipe->id, $fullPayload)
            ->assertOk()
            ->assertJsonPath('data.title', 'Novo Título');

        $this->assertDatabaseHas('recipes', ['id' => $recipe->id, 'title' => 'Novo Título']);
    }

    #[Test]
    public function authorized_user_can_delete_their_own_recipe(): void
    {
        $recipe = Recipe::factory()->for($this->user)->hasSteps(2)->hasIngredients(2)->create();
        Sanctum::actingAs($this->user);

        $this->deleteJson('/api/recipes/' . $recipe->id)->assertNoContent();
        $this->assertDatabaseMissing('recipes', ['id' => $recipe->id]);
    }
}
