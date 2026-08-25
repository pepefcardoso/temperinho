<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends BaseController
{
    public function redirectToProvider(string $provider): JsonResponse
    {
        if (!in_array($provider, ['google', 'github', 'facebook'])) {
            return response()->json(['error' => 'Provedor não suportado.'], 422);
        }

        try {
            /**
             * @var \Laravel\Socialite\Two\AbstractProvider $driver
             */
            $driver = Socialite::driver($provider);
            $url = $driver->stateless()->redirect()->getTargetUrl();

            return response()->json(['url' => $url]);
        } catch (Exception $e) {
            Log::error("Falha ao redirecionar para o provedor $provider: " . $e->getMessage());
            return response()->json(['error' => 'Falha ao iniciar a autenticação.'], 500);
        }
    }

    public function handleProviderCallback(string $provider): RedirectResponse
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');

        if (!in_array($provider, ['google', 'github', 'facebook'])) {
            return redirect()->away($frontendUrl . '/login?error=unsupported-provider');
        }

        try {
            /**
             * @var \Laravel\Socialite\Two\AbstractProvider $driver
             */
            $driver = Socialite::driver($provider);
            $socialUser = $driver->stateless()->user();

            $email = $socialUser->getEmail();

            if (empty($email)) {
                return redirect()->away($frontendUrl . '/login?error=no-email');
            }

            $user = User::firstOrNew(['email' => $email]);

            if ($user->exists && $user->provider !== $provider) {
                return redirect()->away($frontendUrl . '/login?error=email-already-in-use');
            }

            if (!$user->exists) {
                $user->name = $socialUser->getName() ?? $socialUser->getNickname() ?? 'Usuário';
                $user->email_verified_at = now();
                $user->password = null;
            }

            $user->provider = $provider;
            $user->provider_id = $socialUser->getId();
            $user->save();

            $token = $user->createToken('social_auth_token')->plainTextToken;

            return redirect()->away($frontendUrl . '/auth/callback?token=' . $token);
        } catch (Exception $e) {
            Log::error("Falha no callback do provedor $provider: " . $e->getMessage());
            return redirect()->away($frontendUrl . '/auth/login?error=auth-failed');
        }
    }
}
