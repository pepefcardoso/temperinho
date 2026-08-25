<?php

namespace App\Policies;

use App\Models\Subscription;
use App\Models\User;

class SubscriptionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isInternal();
    }

    public function view(User $user, Subscription $subscription): bool
    {
        return $user->isInternal() || $user->id === $subscription->company->user_id;
    }

    public function create(User $user): bool
    {
        return $user->isInternal();
    }

    public function update(User $user, Subscription $subscription): bool
    {
        return $user->isInternal();
    }

    public function delete(User $user, Subscription $subscription): bool
    {
        return $user->isInternal();
    }
}
