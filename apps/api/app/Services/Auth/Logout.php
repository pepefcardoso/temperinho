<?php

namespace App\Services\Auth;

use Exception;
use App\Models\User;
use Laravel\Sanctum\PersonalAccessToken;

class Logout
{
    public function logout(User $user): bool
    {
        try {
            if (! $user) {
                return false;
            }

            /** @var PersonalAccessToken|null $token */
            $token = $user->currentAccessToken();

            if ($token) {
                $token->delete();
            }

            return true;
        } catch (Exception $e) {
            report($e);
            throw $e;
        }
    }
}
