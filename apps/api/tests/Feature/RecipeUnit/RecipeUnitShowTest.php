<?php

namespace Tests\Feature\RecipeUnit;

use App\Models\RecipeUnit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class RecipeUnitShowTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_EndpointShowRetornaUnidadeEspecifica_Sucesso(): void
    {
        // Arrange
        $unit = RecipeUnit::factory()->create();

        // Act
        $response = $this->getJson("/api/recipe-units/{$unit->id}");

        // Assert
        $response->assertStatus(200)
            ->assertJsonPath('data.id', $unit->id)
            ->assertJsonPath('data.name', $unit->name);
    }

    #[Test]
    public function Validar_EndpointShowRetorna404ParaUnidadeInexistente_ErroNotFound(): void
    {
        // Act
        $response = $this->getJson('/api/recipe-units/999');

        // Assert
        $response->assertStatus(404);
    }
}
