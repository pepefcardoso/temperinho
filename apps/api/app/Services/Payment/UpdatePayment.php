<?php

namespace App\Services\Payment;

use App\Models\Payment;
use Illuminate\Support\Facades\Cache;

class UpdatePayment
{
    public function update(Payment $payment, array $data): Payment
    {
        $payment->update($data);

        Cache::tags(['payments'])->flush();

        return $payment;
    }
}
