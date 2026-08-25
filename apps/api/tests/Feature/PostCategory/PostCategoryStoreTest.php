<?php

namespace Tests\Feature\PostCategory;

use App\Enum\RolesEnum;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Str;

class PostCategoryStoreTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_AdminPodeCriarNovaCategoria_Sucesso(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        Sanctum::actingAs($admin);

        $name = 'Nova Categoria';
        $categoryData = ['name' => $name];

        // Act
        $response = $this->postJson('/api/post-categories', $categoryData);

        // Assert
        $response->assertStatus(201);
        $this->assertDatabaseHas('post_categories', [
            'name' => $name,
            'normalized_name' => Str::upper($name)
        ]);
        $response->assertJsonPath('data.name', $name);
    }

    #[Test]
    public function Validar_ClienteNaoPodeCriarCategoria_ErroForbidden(): void
    {
        // Arrange
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($customer);

        // Act
        $response = $this->postJson('/api/post-categories', ['name' => 'Tentativa Falha']);

        // Assert
        $response->assertStatus(403);
    }

    #[Test]
    public function Validar_CriarCategoriaComNomeDuplicadoRetornaErroValidacao_ErroDeValidacao(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $existingCategory = PostCategory::factory()->create();
        Sanctum::actingAs($admin);

        // Act
        $response = $this->postJson('/api/post-categories', ['name' => $existingCategory->name]);

        // Assert
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    #[Test]
    public function Validar_NaoAutenticadoNaoPodeCriarCategoria_ErroUnauthorized(): void
    {
        // Arrange: Nenhum usuário autenticado

        // Act
        $response = $this->postJson('/api/post-categories', ['name' => 'Tentativa sem Auth']);

        // Assert
        $response->assertStatus(401);
    }
}
