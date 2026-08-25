<?php

namespace App\Services\Payment;

use App\Models\Payment;
use Illuminate\Support\Facades\Cache;

class CreatePayment
{
    public function create(array $data): Payment
    {
        $payment = Payment::create($data);

        Cache::tags(['payments'])->flush();

        return $payment;
    }
}
