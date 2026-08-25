<?php

namespace App\Services\PaymentMethod;

use App\Models\PaymentMethod;
use Illuminate\Support\Facades\Cache;

class CreatePaymentMethod
{
    public function create(array $data): PaymentMethod
    {
        $paymentMethod = PaymentMethod::create($data);

        Cache::tags(['payment_methods'])->flush();

        return $paymentMethod;
    }
}
