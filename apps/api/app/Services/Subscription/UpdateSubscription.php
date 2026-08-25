<?php

namespace App\Services\Subscription;

use App\Models\Subscription;
use Illuminate\Support\Facades\Cache;

class UpdateSubscription
{
    public function update(Subscription $subscription, array $data): Subscription
    {
        $subscription->update($data);

        Cache::tags(['subscriptions'])->flush();

        return $subscription;
    }
}
