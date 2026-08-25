<?php

namespace App\Services\Subscription;

use App\Models\Subscription;
use Illuminate\Support\Facades\Cache;

class DeleteSubscription
{
    public function delete(Subscription $subscription): void
    {
        $subscription->delete();

        Cache::tags(['subscriptions'])->flush();
    }
}
