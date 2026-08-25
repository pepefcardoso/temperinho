<?php

namespace App\Policies;

use App\Models\PaymentMethod;
use App\Models\User;
use App\Enum\RolesEnum;

class PaymentMethodPolicy
{
    public function before(User $user, string $ability): bool|null
    {
        if ($user->role === RolesEnum::ADMIN) {
            return true;
        }

        return null;
    }

    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, PaymentMethod $paymentMethod): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isInternal();
    }

    public function update(User $user, PaymentMethod $paymentMethod): bool
    {
        return $user->isInternal();
    }

    public function delete(User $user, PaymentMethod $paymentMethod): bool
    {
        return $user->isInternal();
    }
}
