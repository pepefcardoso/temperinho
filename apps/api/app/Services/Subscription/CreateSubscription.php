<?php

namespace App\Services\Subscription;

use App\Models\Subscription;
use App\Notifications\SubscribedToPlan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class CreateSubscription
{
    public function create(array $data): Subscription
    {
        $existingSubscription = Subscription::where('company_id', $data['company_id'])
            ->whereIsActive()
            ->first();

        if ($existingSubscription) {
            throw ValidationException::withMessages([
                'company_id' => 'This company already has an active subscription.',
            ]);
        }

        $subscription = Subscription::create($data);
        $subscription->company->notify(new SubscribedToPlan($subscription));

        Cache::tags(['subscriptions'])->flush();

        return $subscription;
    }
}
