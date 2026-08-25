<?php

namespace App\Http\Resources\Payment;

use App\Http\Resources\PaymentMethod\PaymentMethodResource;
use App\Http\Resources\Subscription\SubscriptionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'amount' => $this->amount,
            'status' => $this->status,
            'notes' => $this->notes,
            'due_date' => $this->due_date->toIso8601String(),
            'paid_at' => $this->paid_at?->toIso8601String(),
            'created_at' => $this->created_at->toIso8601String(),
            'subscription' => new SubscriptionResource($this->whenLoaded('subscription')),
            'payment_method' => new PaymentMethodResource($this->whenLoaded('method')),
        ];
    }
}
