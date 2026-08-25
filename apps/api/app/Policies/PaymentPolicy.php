<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isInternal();
    }

    public function view(User $user, Payment $payment): bool
    {
        if ($user->isInternal()) {
            return true;
        }

        return $user->id === $payment->subscription->company->user_id;
    }

    public function create(User $user): bool
    {
        return $user->isInternal();
    }

    public function update(User $user, Payment $payment): bool
    {
        return $user->isInternal();
    }

    public function delete(User $user, Payment $payment): bool
    {
        return $user->isInternal();
    }
}
