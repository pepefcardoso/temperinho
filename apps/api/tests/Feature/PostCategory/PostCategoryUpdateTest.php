<?php

namespace Tests\Feature\PostCategory;

use App\Enum\RolesEnum;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostCategoryUpdateTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_AdminPodeAtualizarCategoria_Sucesso(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $category = PostCategory::factory()->create();
        Sanctum::actingAs($admin);

        $updateData = ['name' => 'Nome Atualizado'];

        // Act
        $response = $this->putJson("/api/post-categories/{$category->id}", $updateData);

        // Assert
        $response->assertStatus(200);
        $this->assertDatabaseHas('post_categories', [
            'id' => $category->id,
            'name' => 'Nome Atualizado'
        ]);
        $response->assertJsonPath('data.name', 'Nome Atualizado');
    }

    #[Test]
    public function Validar_ClienteNaoPodeAtualizarCategoria_ErroForbidden(): void
    {
        // Arrange
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $category = PostCategory::factory()->create();
        Sanctum::actingAs($customer);

        // Act
        $response = $this->putJson("/api/post-categories/{$category->id}", ['name' => 'Tentativa Falha']);

        // Assert
        $response->assertStatus(403);
    }
}
