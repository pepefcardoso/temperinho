<?php

namespace Tests\Feature\User;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserUpdateTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_UsuarioPodeAtualizarPropriosDados_Sucesso(): void
    {
        // --- ARRANGE ---
        // Cria um usuário que fará a requisição
        $user = User::factory()->create([
            'name' => 'Nome Antigo',
            'email' => 'antigo@email.com',
        ]);

        // Autentica como este usuário
        Sanctum::actingAs($user);

        // Define os novos dados para a atualização
        $updateData = [
            'name' => 'Nome Novo Teste',
            'email' => 'novo@email.com',
        ];

        // --- ACT ---
        // Envia a requisição para o endpoint de atualização
        $response = $this->putJson("/api/users/{$user->id}", $updateData);

        // --- ASSERT ---
        // Verifica se a resposta foi 200 (OK)
        $response->assertStatus(200);

        // Verifica se o JSON de resposta contém o novo nome
        $response->assertJsonPath('data.name', 'Nome Novo Teste');

        // Verifica se o banco de dados foi realmente atualizado
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Nome Novo Teste',
            'email' => 'novo@email.com',
        ]);
    }

    #[Test]
    public function Validar_UsuarioNaoPodeAtualizarDadosDeOutroUsuario_Erro(): void
    {
        // --- ARRANGE ---
        // Cria dois usuários distintos
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        // Autentica como o usuário A
        Sanctum::actingAs($userA);

        $updateData = ['name' => 'Nome Invasor'];

        // --- ACT ---
        // Usuário A tenta atualizar os dados do usuário B
        $response = $this->putJson("/api/users/{$userB->id}", $updateData);

        // --- ASSERT ---
        // A política de autorização em UpdateUserRequest deve barrar a ação
        $response->assertStatus(403); // Forbidden

        // Garante que o nome do usuário B não foi alterado no banco
        $this->assertDatabaseMissing('users', [
            'id' => $userB->id,
            'name' => 'Nome Invasor',
        ]);
    }

    #[Test]
    public function Validar_AtualizacaoComEmailJaExistente_ErroDeValidacao(): void
    {
        // --- ARRANGE ---
        // Cria dois usuários
        $userA = User::factory()->create();
        $userB = User::factory()->create(['email' => 'email.existente@teste.com']);

        // Autentica como usuário A
        Sanctum::actingAs($userA);

        // Tenta atualizar o email do usuário A para o email do usuário B
        $updateData = ['email' => 'email.existente@teste.com'];

        // --- ACT ---
        $response = $this->putJson("/api/users/{$userA->id}", $updateData);

        // --- ASSERT ---
        // A requisição deve falhar por violação da regra 'unique' de e-mail
        $response->assertStatus(422); // Unprocessable Entity
        $response->assertJsonValidationErrors(['email']);
    }

    #[Test]
    public function Validar_RequisicaoNaoAutenticada_Erro(): void
    {
        // --- ARRANGE ---
        // Cria um usuário alvo para a atualização
        $user = User::factory()->create();
        $updateData = ['name' => 'Qualquer Nome'];

        // --- ACT ---
        // Envia a requisição sem autenticação (sem Sanctum::actingAs)
        $response = $this->putJson("/api/users/{$user->id}", $updateData);

        // --- ASSERT ---
        // O middleware 'auth:sanctum' deve retornar erro 401
        $response->assertStatus(401); // Unauthorized
    }
}
