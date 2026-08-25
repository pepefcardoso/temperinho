<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_LoginComCredenciaisCorretas_Sucesso(): void
    {
        // --- ARRANGE ---
        // Cria um usuário para o teste
        $user = User::factory()->create([
            'email' => 'usuario@teste.com',
            'password' => bcrypt('password123'),
        ]);

        $loginData = [
            'email' => 'usuario@teste.com',
            'password' => 'password123',
        ];

        // --- ACT ---
        // Envia a requisição para a rota de login
        $response = $this->postJson('/api/auth/login', $loginData);

        // --- ASSERT ---
        // Verifica se a resposta foi 201 (Created)
        $response->assertStatus(201);

        // Verifica a estrutura do JSON de resposta
        $response->assertJsonStructure([
            'token',
            'user' => [
                'id',
                'name',
                'email',
                'role',
                'image',
                'created_at',
            ]
        ]);

        // Verifica se o email do usuário na resposta é o correto
        $response->assertJsonPath('user.email', $user->email);
    }

    #[Test]
    public function Validar_LoginComSenhaIncorreta_Erro(): void
    {
        // --- ARRANGE ---
        // Cria um usuário
        User::factory()->create([
            'email' => 'usuario@teste.com',
            'password' => bcrypt('password123'),
        ]);

        $loginData = [
            'email' => 'usuario@teste.com',
            'password' => 'senha-errada',
        ];

        // --- ACT ---
        $response = $this->postJson('/api/auth/login', $loginData);

        // --- ASSERT ---
        // Verifica se a resposta foi 422 (Unprocessable Entity)
        $response->assertStatus(422);

        // Verifica se há um erro de validação para o campo 'email'
        $response->assertJsonValidationErrors(['email']);

        // Verifica a mensagem de erro específica
        $response->assertJsonFragment([
            'email' => [__('auth.failed')]
        ]);
    }

    #[Test]
    public function Validar_LoginComEmailNaoExistente_Erro(): void
    {
        // --- ARRANGE ---
        $loginData = [
            'email' => 'naoexiste@teste.com',
            'password' => 'password123',
        ];

        // --- ACT ---
        $response = $this->postJson('/api/auth/login', $loginData);

        // --- ASSERT ---
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
        $response->assertJsonFragment([
            'email' => [__('auth.failed')]
        ]);
    }


    #[Test]
    public function Validar_LoginComDadosInvalidos_ErroDeValidacao(): void
    {
        // --- ARRANGE ---
        $loginData = [
            'email' => 'email-invalido', // Formato de e-mail inválido
            // Senha faltando
        ];

        // --- ACT ---
        $response = $this->postJson('/api/auth/login', $loginData);

        // --- ASSERT ---
        // Verifica se a resposta foi 422
        $response->assertStatus(422);

        // Verifica se há erros de validação para 'email' e 'password'
        $response->assertJsonValidationErrors(['email', 'password']);
    }
}
