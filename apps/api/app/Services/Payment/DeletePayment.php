<?php

namespace App\Services\Payment;

use App\Models\Payment;
use Illuminate\Support\Facades\Cache;

class DeletePayment
{
    public function delete(Payment $payment): void
    {
        $payment->delete();

        Cache::tags(['payments'])->flush();
    }
}
