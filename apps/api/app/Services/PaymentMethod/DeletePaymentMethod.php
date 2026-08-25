<?php

namespace App\Services\PaymentMethod;

use App\Models\PaymentMethod;
use Illuminate\Support\Facades\Cache;

class DeletePaymentMethod
{
    public function delete(PaymentMethod $paymentMethod): void
    {
        $paymentMethod->delete();

        Cache::tags(['payment_methods'])->flush();
    }
}
