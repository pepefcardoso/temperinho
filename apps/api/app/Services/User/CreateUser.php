<?php

namespace App\Services\User;

use App\Models\User;
use App\Notifications\CreatedUser;
use Illuminate\Support\Arr;

class CreateUser
{
    /**
     * Cria um novo usuário e envia uma notificação de boas-vindas.
     * A transação foi removida por conter apenas uma operação de escrita.
     *
     * @param array $data Os dados validados para a criação do usuário.
     * @return User
     */
    public function create(array $data): User
    {
        $userData = Arr::except($data, ['password_confirmation']);

        $user = User::create($userData);

        $user->notify(new CreatedUser($user));

        return $user->fresh();
    }
}
