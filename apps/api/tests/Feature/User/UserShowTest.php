<?php

namespace Tests\Feature\User;

use App\Enum\RolesEnum;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserShowTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_UsuarioPodeVerProprioPerfil_Sucesso(): void
    {
        // --- ARRANGE ---
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($customer);

        // --- ACT ---
        $response = $this->getJson("/api/users/{$customer->id}");

        // --- ASSERT ---
        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $customer->id);
        $response->assertJsonPath('data.email', $customer->email);
    }

    #[Test]
    public function Validar_AdminPodeVerQualquerPerfil_Sucesso(): void
    {
        // --- ARRANGE ---
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($admin);

        // --- ACT ---
        $response = $this->getJson("/api/users/{$customer->id}");

        // --- ASSERT ---
        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $customer->id);
    }

    #[Test]
    public function Validar_UsuarioNaoPodeVerPerfilDeOutro_Erro(): void
    {
        // --- ARRANGE ---
        $customerA = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $customerB = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($customerA);

        // --- ACT ---
        $response = $this->getJson("/api/users/{$customerB->id}");

        // --- ASSERT ---
        $response->assertStatus(403); // Forbidden
    }

    #[Test]
    public function Validar_NaoAutenticadoNaoPodeVerPerfil_Erro(): void
    {
        // --- ARRANGE ---
        $customer = User::factory()->create();

        // --- ACT ---
        $response = $this->getJson("/api/users/{$customer->id}");

        // --- ASSERT ---
        $response->assertStatus(401); // Unauthorized
    }
}
