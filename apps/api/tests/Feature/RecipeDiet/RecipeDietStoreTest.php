<?php

namespace Tests\Feature\RecipeDiet;

use App\Enum\RolesEnum;
use App\Models\RecipeDiet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Str;

class RecipeDietStoreTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    #[Test]
    public function Validar_AdminPodeCriarNovaDieta_Sucesso(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        Sanctum::actingAs($admin);
        $name = 'Vegetariana';

        // Act
        $response = $this->postJson('/api/recipe-diets', ['name' => $name]);

        // Assert
        $response->assertStatus(201);
        $this->assertDatabaseHas('recipe_diets', [
            'name' => $name,
            'normalized_name' => Str::upper($name)
        ]);
        $response->assertJsonPath('data.name', $name);
    }

    #[Test]
    public function Validar_ClienteNaoPodeCriarDieta_ErroForbidden(): void
    {
        // Arrange
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($customer);

        // Act
        $response = $this->postJson('/api/recipe-diets', ['name' => 'Tentativa Falha']);

        // Assert
        $response->assertStatus(403);
    }
}
