<?php

namespace App\Services\User;

use App\Models\User;

class UpdateUserRole
{
    public function execute(User $user, string $role): User
    {
        $user->update(['role' => $role]);

        return $user;
    }
}
