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
use Illuminate\Support\Str;

class RecipeCategoryStoreTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    #[Test]
    public function Validar_AdminPodeCriarNovaCategoria_Sucesso(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        Sanctum::actingAs($admin);
        $name = 'Massas Italianas';

        // Act
        $response = $this->postJson('/api/recipe-categories', ['name' => $name]);

        // Assert
        $response->assertStatus(201);
        $this->assertDatabaseHas('recipe_categories', [
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
        $response = $this->postJson('/api/recipe-categories', ['name' => 'Tentativa Falha']);

        // Assert
        $response->assertStatus(403);
    }

    #[Test]
    public function Validar_CriarCategoriaComNomeDuplicadoFalha_ErroDeValidacao(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $existing = RecipeCategory::factory()->create();
        Sanctum::actingAs($admin);

        // Act
        $response = $this->postJson('/api/recipe-categories', ['name' => $existing->name]);

        // Assert
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }
}
