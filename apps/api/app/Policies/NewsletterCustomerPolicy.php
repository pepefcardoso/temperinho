<?php

namespace App\Policies;

use App\Models\NewsletterCustomer;
use App\Models\User;

class NewsletterCustomerPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isInternal();
    }

    public function view(User $user, NewsletterCustomer $newsletterCustomer): bool
    {
        return $user->isInternal();
    }

    public function create(?User $user): bool
    {
        return true;
    }

    public function update(User $user, NewsletterCustomer $newsletterCustomer): bool
    {
        return $user->isInternal();
    }

    public function delete(User $user, NewsletterCustomer $newsletterCustomer): bool
    {
        return $user->isInternal();
    }
}
