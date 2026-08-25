<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Password;

class ResetPassword
{
    public function execute(array $data): string
    {
        return Password::reset(
            $data,
            function ($user, $password) {
                $user->password = $password;
                $user->save();
            }
        );
    }
}
