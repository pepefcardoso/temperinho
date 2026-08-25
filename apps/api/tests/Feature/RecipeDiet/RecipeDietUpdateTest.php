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

class RecipeDietUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    #[Test]
    public function Validar_AdminPodeAtualizarDieta_Sucesso(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $diet = RecipeDiet::factory()->create();
        Sanctum::actingAs($admin);
        $updateData = ['name' => 'Vegana'];

        // Act
        $response = $this->putJson("/api/recipe-diets/{$diet->id}", $updateData);

        // Assert
        $response->assertStatus(200);
        $this->assertDatabaseHas('recipe_diets', [
            'id' => $diet->id,
            'name' => 'Vegana'
        ]);
    }

    #[Test]
    public function Validar_ClienteNaoPodeAtualizarDieta_ErroForbidden(): void
    {
        // Arrange
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $diet = RecipeDiet::factory()->create();
        Sanctum::actingAs($customer);

        // Act
        $response = $this->putJson("/api/recipe-diets/{$diet->id}", ['name' => 'Tentativa']);

        // Assert
        $response->assertStatus(403);
    }
}
