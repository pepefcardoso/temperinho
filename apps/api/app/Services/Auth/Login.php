<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class Login
{
    /**
     * O usuário autenticado.
     * @var \App\Models\User|null
     */
    protected ?User $user = null;

    /**
     * @throws ValidationException
     */
    public function login(array $data): string
    {
        $email = data_get($data, "email");
        $password = data_get($data, 'password');

        $user = User::where('email', $email)->first();

        if (
            !$user
            || !Hash::check($password, $user->getAuthPassword())
        ) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }


        $this->user = $user;

        return $user->createToken('auth_token')->plainTextToken;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }
}
