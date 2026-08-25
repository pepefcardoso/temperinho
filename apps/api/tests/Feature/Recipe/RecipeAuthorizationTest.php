<?php

namespace Tests\Feature\Recipe;

use App\Models\Recipe;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class RecipeAuthorizationTest extends TestCase
{
    use RefreshDatabase, RecipeTestSetup;

    #[Test]
    public function unauthenticated_user_cannot_create_a_recipe(): void
    {
        $this->postJson('/api/recipes', [])->assertUnauthorized();
    }

    #[Test]
    public function user_cannot_update_another_users_recipe(): void
    {
        $recipeOwner = User::factory()->create();
        $recipe = Recipe::factory()->for($recipeOwner)->create();
        Sanctum::actingAs($this->user);

        $this->putJson('/api/recipes/' . $recipe->id, [])->assertForbidden();
    }

    #[Test]
    public function user_cannot_delete_another_users_recipe(): void
    {
        $recipe = Recipe::factory()->for(User::factory())->create();
        Sanctum::actingAs($this->user);

        $this->deleteJson('/api/recipes/' . $recipe->id)->assertForbidden();
    }

    #[Test]
    public function admin_can_update_any_recipe(): void
    {
        $recipe = Recipe::factory()->for($this->user)->hasSteps(2)->hasIngredients(2)->create();
        Sanctum::actingAs($this->admin);
        $payload = array_merge($this->getRecipeDataForUpdate($recipe), ['title' => 'Admin Edit']);

        $this->putJson('/api/recipes/' . $recipe->id, $payload)->assertOk();
    }

    #[Test]
    public function admin_can_delete_any_recipe(): void
    {
        $recipe = Recipe::factory()->for($this->user)->hasSteps(2)->hasIngredients(2)->create();
        Sanctum::actingAs($this->admin);

        $this->deleteJson('/api/recipes/' . $recipe->id)->assertNoContent();
    }
}
