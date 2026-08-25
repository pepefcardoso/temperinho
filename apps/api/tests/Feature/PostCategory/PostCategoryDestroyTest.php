<?php

namespace Tests\Feature\PostCategory;

use App\Enum\RolesEnum;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostCategoryDestroyTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_AdminPodeDeletarCategoriaNaoUtilizada_ErroForbidden(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $category = PostCategory::factory()->create();
        Sanctum::actingAs($admin);

        // Act
        $response = $this->deleteJson("/api/post-categories/{$category->id}");

        // Assert
        $response->assertStatus(204);
        $this->assertDatabaseMissing('post_categories', ['id' => $category->id]);
    }

    #[Test]
    public function Validar_AdminNaoPodeDeletarCategoriaEmUso_ErroForbidden(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $categoryInUse = PostCategory::factory()->create();
        // Cria um post associado a esta categoria, colocando-a "em uso"
        Post::factory()->create(['category_id' => $categoryInUse->id]);
        Sanctum::actingAs($admin);

        // Act
        $response = $this->deleteJson("/api/post-categories/{$categoryInUse->id}");

        // Assert
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['category']);
        $this->assertDatabaseHas('post_categories', ['id' => $categoryInUse->id]);
    }

    #[Test]
    public function Validar_ClienteNaoPodeDeletarCategoria_ErroForbidden(): void
    {
        // Arrange
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $category = PostCategory::factory()->create();
        Sanctum::actingAs($customer);

        // Act
        $response = $this->deleteJson("/api/post-categories/{$category->id}");

        // Assert
        $response->assertStatus(403);
    }
}
