<?php

namespace Tests\Feature\Auth;

use App\Enum\RolesEnum;
use App\Models\User;
use App\Notifications\CreatedUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Notification;
use PHPUnit\Framework\Attributes\Test;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;


    #[Test]
    public function Validar_RegistroNovoUsuario_Sucesso(): void
    {
        // --- ARRANGE ---
        Notification::fake();
        $userData = [
            'name' => 'Pedro Teste',
            'email' => 'pedro@teste.com',
            'phone' => '11987654321',
            'birthday' => '2000-01-01',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        // --- ACT ---
        $response = $this->postJson('/api/users', $userData);

        // --- ASSERT ---
        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'pedro@teste.com']);
        $user = User::where('email', 'pedro@teste.com')->first();
        Notification::assertSentTo($user, CreatedUser::class);
        $response->assertJsonPath('user.name', 'Pedro Teste');
        $response->assertJsonPath('user.role', RolesEnum::CUSTOMER->name);
        $response->assertJsonStructure([
            'token',
            'user' => ['id', 'name', 'email', 'role', 'created_at']
        ]);
    }

    #[Test]
    public function Validar_RegistroDadosInvalidos_Erro(): void
    {
        // --- ARRANGE ---
        $invalidUserData = [
            'email' => 'email-invalido',
            'password' => '123',
            'password_confirmation' => '456',
        ];

        // --- ACT ---
        $response = $this->postJson('/api/users', $invalidUserData);

        // --- ASSERT ---
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    #[Test]
    public function Validar_RegistroEmailJaExiste_Erro(): void
    {
        // --- ARRANGE ---
        User::factory()->create(['email' => 'email.existente@laravel.com']);

        $userData = [
            'name' => 'Outro Usuario',
            'email' => 'email.existente@laravel.com',
            'phone' => '11999999999',
            'birthday' => '2000-01-01',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        // --- ACT ---
        $response = $this->postJson('/api/users', $userData);

        // --- ASSERT ---
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }
}
