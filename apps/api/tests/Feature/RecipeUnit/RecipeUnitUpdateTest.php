<?php

namespace Tests\Feature\RecipeUnit;

use App\Enum\RolesEnum;
use App\Models\RecipeUnit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class RecipeUnitUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    #[Test]
    public function Validar_AdminPodeAtualizarUnidade_Sucesso(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $unit = RecipeUnit::factory()->create();
        Sanctum::actingAs($admin);
        $updateData = ['name' => 'Litros'];

        // Act
        $response = $this->putJson("/api/recipe-units/{$unit->id}", $updateData);

        // Assert
        $response->assertStatus(200);
        $this->assertDatabaseHas('recipe_units', [
            'id' => $unit->id,
            'name' => 'Litros'
        ]);
    }

    #[Test]
    public function Validar_ClienteNaoPodeAtualizarUnidade_ErroForbidden(): void
    {
        // Arrange
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $unit = RecipeUnit::factory()->create();
        Sanctum::actingAs($customer);

        // Act
        $response = $this->putJson("/api/recipe-units/{$unit->id}", ['name' => 'Tentativa']);

        // Assert
        $response->assertStatus(403);
    }
}
