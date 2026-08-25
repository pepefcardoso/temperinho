<?php

namespace Tests\Feature\RecipeUnit;

use App\Enum\RolesEnum;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;
use Illuminate\Support\Str;

class RecipeUnitStoreTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    #[Test]
    public function Validar_AdminPodeCriarNovaUnidade_Sucesso(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        Sanctum::actingAs($admin);
        $name = 'Gramas';

        // Act
        $response = $this->postJson('/api/recipe-units', ['name' => $name]);

        // Assert
        $response->assertStatus(201);
        $this->assertDatabaseHas('recipe_units', [
            'name' => $name,
            'normalized_name' => Str::upper($name)
        ]);
        $response->assertJsonPath('data.name', $name);
    }

    #[Test]
    public function Validar_ClienteNaoPodeCriarUnidade_ErroForbidden(): void
    {
        // Arrange
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($customer);

        // Act
        $response = $this->postJson('/api/recipe-units', ['name' => 'Tentativa Falha']);

        // Assert
        $response->assertStatus(403);
    }
}
