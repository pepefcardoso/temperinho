<?php

namespace App\Policies;

use App\Models\CustomerContact;
use App\Models\User;

class CustomerContactPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isInternal();
    }

    public function view(User $user, CustomerContact $customerContact): bool
    {
        return $user->isInternal();
    }

    public function create(?User $user): bool
    {
        return true;
    }

    public function update(User $user, CustomerContact $customerContact): bool
    {
        return $user->isInternal();
    }

    public function delete(User $user, CustomerContact $customerContact): bool
    {
        return $user->isInternal();
    }
}
