<?php

namespace Tests\Feature\User;

use App\Enum\RolesEnum;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserListTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_AdminPodeListarUsuarios_Sucesso(): void
    {
        // --- ARRANGE ---
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        User::factory()->count(5)->create(['role' => RolesEnum::CUSTOMER]); // Cria mais 5 usuários
        Sanctum::actingAs($admin);

        // --- ACT ---
        $response = $this->getJson('/api/users');

        // --- ASSERT ---
        $response->assertStatus(200);
        // Espera 6 usuários no total (1 admin + 5 customers)
        $response->assertJsonCount(6, 'data');
        $response->assertJsonStructure(['data', 'links', 'meta']);
    }

    #[Test]
    public function Validar_ClienteNaoPodeListarUsuarios_Erro(): void
    {
        // --- ARRANGE ---
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($customer);

        // --- ACT ---
        $response = $this->getJson('/api/users');

        // --- ASSERT ---
        $response->assertStatus(403); // Forbidden
    }

    #[Test]
    public function Validar_FiltroDeBuscaNaListagem_Sucesso(): void
    {
        // --- ARRANGE ---
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $userToFind = User::factory()->create(['name' => 'Usuario Alvo Especifico']);
        User::factory()->count(3)->create();
        Sanctum::actingAs($admin);

        // --- ACT ---
        $response = $this->getJson('/api/users?search=Usuario%20Alvo');

        // --- ASSERT ---
        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.name', $userToFind->name);
    }

    #[Test]
    public function Validar_FiltroDeRoleNaListagem_Sucesso(): void
    {
        // --- ARRANGE ---
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        User::factory()->count(3)->create(['role' => RolesEnum::CUSTOMER]);
        User::factory()->count(2)->create(['role' => RolesEnum::INTERNAL]);
        Sanctum::actingAs($admin);

        $internalRoleValue = RolesEnum::INTERNAL->value;

        // --- ACT ---
        $response = $this->getJson("/api/users?role[]={$internalRoleValue}");

        // --- ASSERT ---
        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
        // Verifica se todos os usuários retornados têm a role correta
        foreach ($response->json('data') as $user) {
            $this->assertEquals(RolesEnum::INTERNAL->name, $user['role']);
        }
    }
}
