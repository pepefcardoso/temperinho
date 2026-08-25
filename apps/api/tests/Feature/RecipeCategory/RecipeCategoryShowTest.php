<?php

namespace Tests\Feature\RecipeCategory;

use App\Models\RecipeCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class RecipeCategoryShowTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_EndpointShowRetornaCategoriaEspecifica_Sucesso(): void
    {
        // Arrange
        $category = RecipeCategory::factory()->create();

        // Act
        $response = $this->getJson("/api/recipe-categories/{$category->id}");

        // Assert
        $response->assertStatus(200)
            ->assertJsonPath('data.id', $category->id)
            ->assertJsonPath('data.name', $category->name);
    }

    #[Test]
    public function Validar_EndpointShowRetorna404ParaCategoriaInexistente_ErroNotFound(): void
    {
        // Act
        $response = $this->getJson('/api/recipe-categories/999');

        // Assert
        $response->assertStatus(404);
    }
}
