<?php

namespace Tests\Feature\RecipeCategory;

use App\Enum\RolesEnum;
use App\Models\Recipe;
use App\Models\RecipeCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class RecipeCategoryDestroyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    #[Test]
    public function Validar_AdminPodeDeletarCategoriaNaoUtilizada_ErroForbidden(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $category = RecipeCategory::factory()->create();
        Sanctum::actingAs($admin);

        // Act
        $response = $this->deleteJson("/api/recipe-categories/{$category->id}");

        // Assert
        $response->assertStatus(204);
        $this->assertDatabaseMissing('recipe_categories', ['id' => $category->id]);
    }

    #[Test]
    public function Validar_AdminNaoPodeDeletarCategoriaEmUso_ErroForbidden(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $categoryInUse = RecipeCategory::factory()->create();
        Recipe::factory()->create(['category_id' => $categoryInUse->id]);
        Sanctum::actingAs($admin);

        // Act
        $response = $this->deleteJson("/api/recipe-categories/{$categoryInUse->id}");

        // Assert
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['category']);
        $this->assertDatabaseHas('recipe_categories', ['id' => $categoryInUse->id]);
    }
}
