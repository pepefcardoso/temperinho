<?php

namespace Tests\Feature\RecipeDiet;

use App\Enum\RolesEnum;
use App\Models\Recipe;
use App\Models\RecipeDiet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class RecipeDietDestroyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    #[Test]
    public function Validar_AdminPodeDeletarDietaNaoUtilizada_ErroForbidden(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $diet = RecipeDiet::factory()->create();
        Sanctum::actingAs($admin);

        // Act
        $response = $this->deleteJson("/api/recipe-diets/{$diet->id}");

        // Assert
        $response->assertStatus(204);
        $this->assertDatabaseMissing('recipe_diets', ['id' => $diet->id]);
    }

    #[Test]
    public function Validar_AdminNaoPodeDeletarDietaEmUso_ErroForbidden(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $dietInUse = RecipeDiet::factory()->create();
        // Cria uma receita e a associa com a dieta, colocando-a "em uso"
        Recipe::factory()->create()->diets()->attach($dietInUse->id);
        Sanctum::actingAs($admin);

        // Act
        $response = $this->deleteJson("/api/recipe-diets/{$dietInUse->id}");

        // Assert
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['diet']);
        $this->assertDatabaseHas('recipe_diets', ['id' => $dietInUse->id]);
    }
}
