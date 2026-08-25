<?php

namespace Tests\Feature\RecipeCategory;

use App\Enum\RolesEnum;
use App\Models\RecipeCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class RecipeCategoryUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    #[Test]
    public function Validar_AdminPodeAtualizarCategoria_Sucesso(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $category = RecipeCategory::factory()->create();
        Sanctum::actingAs($admin);
        $updateData = ['name' => 'Sobremesas'];

        // Act
        $response = $this->putJson("/api/recipe-categories/{$category->id}", $updateData);

        // Assert
        $response->assertStatus(200);
        $this->assertDatabaseHas('recipe_categories', [
            'id' => $category->id,
            'name' => 'Sobremesas'
        ]);
    }

    #[Test]
    public function Validar_ClienteNaoPodeAtualizarCategoria_ErroForbidden(): void
    {
        // Arrange
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $category = RecipeCategory::factory()->create();
        Sanctum::actingAs($customer);

        // Act
        $response = $this->putJson("/api/recipe-categories/{$category->id}", ['name' => 'Tentativa']);

        // Assert
        $response->assertStatus(403);
    }
}
