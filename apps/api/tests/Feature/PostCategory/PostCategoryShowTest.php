<?php

namespace Tests\Feature\PostCategory;

use App\Models\PostCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostCategoryShowTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_EndpointShowRetornaCategoriaEspecifica_Sucesso(): void
    {
        // Arrange
        $category = PostCategory::factory()->create();

        // Act
        $response = $this->getJson("/api/post-categories/{$category->id}");

        // Assert
        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $category->id);
        $response->assertJsonPath('data.name', $category->name);
    }

    #[Test]
    public function Validar_EndpointShowRetorna404ParaCategoriaInexistente_ErroNotFound(): void
    {
        // Act
        $response = $this->getJson('/api/post-categories/999');

        // Assert
        $response->assertStatus(404);
    }
}
