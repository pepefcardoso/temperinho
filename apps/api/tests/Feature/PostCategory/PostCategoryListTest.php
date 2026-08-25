<?php

namespace Tests\Feature\PostCategory;

use App\Models\PostCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostCategoryListTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_EndpointIndexRetornaListaDeCategorias_Sucesso(): void
    {
        // Arrange
        // Cria 3 categorias para o teste
        PostCategory::factory()->count(3)->create();

        // Act
        // Faz a requisição para o endpoint de listagem
        $response = $this->getJson('/api/post-categories');

        // Assert
        // Verifica se a resposta foi 200 (OK) e se contém 3 itens no array 'data'
        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name']
            ]
        ]);
    }

    #[Test]
    public function Validar_EndpointIndexRetornaArrayVazioSeNaoHaCategorias_ErroForbidden(): void
    {
        // Arrange: Nenhuma categoria criada

        // Act
        $response = $this->getJson('/api/post-categories');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonCount(0, 'data');
    }
}
