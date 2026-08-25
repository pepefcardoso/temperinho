<?php

namespace App\Services\PaymentMethod;

use App\Models\PaymentMethod;
use Illuminate\Support\Facades\Cache;

class UpdatePaymentMethod
{
    public function update(PaymentMethod $paymentMethod, array $data): PaymentMethod
    {
        $paymentMethod->update($data);

        Cache::tags(['payment_methods'])->flush();

        return $paymentMethod;
    }
}
