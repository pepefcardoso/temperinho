<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Subscription;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $subscriptions = Subscription::all();
        $paymentMethodIds = PaymentMethod::pluck('id');

        if ($subscriptions->isEmpty() || $paymentMethodIds->isEmpty()) {
            $this->command->info('No subscriptions or payment methods found, skipping PaymentSeeder.');
            return;
        }

        foreach ($subscriptions as $subscription) {
            Payment::factory()
                ->count(3)
                ->for($subscription)
                ->create([
                    'payment_method_id' => $paymentMethodIds->random(),
                ]);
        }
    }
}
