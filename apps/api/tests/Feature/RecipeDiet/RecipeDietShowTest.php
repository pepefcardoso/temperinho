<?php

namespace Tests\Feature\RecipeDiet;

use App\Models\RecipeDiet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class RecipeDietShowTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_EndpointShowRetornaDietaEspecifica_Sucesso(): void
    {
        // Arrange
        $diet = RecipeDiet::factory()->create();

        // Act
        $response = $this->getJson("/api/recipe-diets/{$diet->id}");

        // Assert
        $response->assertStatus(200)
            ->assertJsonPath('data.id', $diet->id)
            ->assertJsonPath('data.name', $diet->name);
    }

    #[Test]
    public function Validar_EndpointShowRetorna404ParaDietaInexistente_ErroNotFound(): void
    {
        // Act
        $response = $this->getJson('/api/recipe-diets/999');

        // Assert
        $response->assertStatus(404);
    }
}
