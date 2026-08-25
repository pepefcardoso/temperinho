<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SocialAuthTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_RedirecionamentoParaProvedorInvalido_ErroDeValidacao(): void
    {
        // --- ACT ---
        $response = $this->getJson('/api/auth/social/invalid-provider');

        // --- ASSERT ---
        $response->assertStatus(422)
            ->assertJson([
                'error' => 'Provedor não suportado.'
            ]);
    }

    #[Test]
    public function Validar_CallbackDeProvedorInvalido_RedirecionaComErro(): void
    {
        // --- ARRANGE ---
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');

        // --- ACT ---
        $response = $this->get('/api/auth/social/invalid-provider/callback');

        // --- ASSERT ---
        $response->assertRedirect($frontendUrl . '/login?error=unsupported-provider');
    }

    #[Test]
    public function Validar_CallbackSocialAuthEmailJaEmUso_RedirecionaComErro(): void
    {
        // --- ARRANGE ---
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
        $user = \App\Models\User::factory()->create([
            'email' => 'test@example.com',
            'provider' => null,
            'password' => bcrypt('password123')
        ]);

        $socialUser = $this->createMock(\Laravel\Socialite\Two\User::class);
        $socialUser->method('getEmail')->willReturn('test@example.com');
        $socialUser->method('getName')->willReturn('Test User');
        $socialUser->method('getId')->willReturn('123456');

        $providerMock = $this->createMock(\Laravel\Socialite\Two\AbstractProvider::class);
        $providerMock->method('stateless')->willReturnSelf();
        $providerMock->method('user')->willReturn($socialUser);

        \Laravel\Socialite\Facades\Socialite::shouldReceive('driver')
            ->with('google')
            ->andReturn($providerMock);

        // --- ACT ---
        $response = $this->get('/api/auth/social/google/callback');

        // --- ASSERT ---
        $response->assertRedirect($frontendUrl . '/login?error=email-already-in-use');
    }
}
