<?php

namespace Tests\Feature\RecipeCategory;

use App\Models\RecipeCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class RecipeCategoryListTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    #[Test]
    public function Validar_EndpointIndexRetornaListaDeCategorias_Sucesso(): void
    {
        // Arrange
        RecipeCategory::factory()->count(3)->create();

        // Act
        $response = $this->getJson('/api/recipe-categories');

        // Assert
        $response->assertStatus(200)
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure(['data' => ['*' => ['id', 'name']]]);
    }

    #[Test]
    public function Validar_EndpointIndexRetornaArrayVazioSeNaoHaCategorias_ErroForbidden(): void
    {
        // Act
        $response = $this->getJson('/api/recipe-categories');

        // Assert
        $response->assertStatus(200)->assertJsonCount(0, 'data');
    }
}
