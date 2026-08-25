<?php

namespace Tests\Feature\RecipeUnit;

use App\Enum\RolesEnum;
use App\Models\RecipeIngredient;
use App\Models\RecipeUnit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class RecipeUnitDestroyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    #[Test]
    public function Validar_AdminPodeDeletarUnidadeNaoUtilizada_ErroForbidden(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $unit = RecipeUnit::factory()->create();
        Sanctum::actingAs($admin);

        // Act
        $response = $this->deleteJson("/api/recipe-units/{$unit->id}");

        // Assert
        $response->assertStatus(204);
        $this->assertDatabaseMissing('recipe_units', ['id' => $unit->id]);
    }

    #[Test]
    public function Validar_AdminNaoPodeDeletarUnidadeEmUso_ErroForbidden(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $unitInUse = RecipeUnit::factory()->create();
        // Cria um ingrediente associado a esta unidade, colocando-a "em uso"
        RecipeIngredient::factory()->create(['unit_id' => $unitInUse->id]);
        Sanctum::actingAs($admin);

        // Act
        $response = $this->deleteJson("/api/recipe-units/{$unitInUse->id}");

        // Assert
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['unit']);
        $this->assertDatabaseHas('recipe_units', ['id' => $unitInUse->id]);
    }
}
