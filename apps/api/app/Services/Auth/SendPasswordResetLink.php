<?php

namespace App\Services\Auth;

use Illuminate\Support\Facades\Password;

class SendPasswordResetLink
{
    public function execute(array $data): void
    {
        Password::sendResetLink($data);
    }
}
