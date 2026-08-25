<?php

namespace Tests\Feature\Recipe;

use App\Models\Recipe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class UserRecipeActionsTest extends TestCase
{
    use RefreshDatabase, RecipeTestSetup;

    #[Test]
    public function authenticated_user_can_list_their_own_recipes(): void
    {
        Recipe::factory(3)->for($this->user)->create();
        Recipe::factory(2)->create(); // Receitas de outro utilizador

        Sanctum::actingAs($this->user);

        $this->getJson('/api/recipes/my')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    #[Test]
    public function authenticated_user_can_list_their_favorite_recipes(): void
    {
        $recipes = Recipe::factory(5)->create();
        $this->user->favoriteRecipes()->attach($recipes->take(2)->pluck('id'));

        Sanctum::actingAs($this->user);

        $this->getJson('/api/recipes/favorites')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }
}
