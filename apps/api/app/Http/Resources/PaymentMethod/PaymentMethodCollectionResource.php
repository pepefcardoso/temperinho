<?php

namespace App\Http\Resources\PaymentMethod;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PaymentMethodCollectionResource extends ResourceCollection
{
    public $collects = PaymentMethodResource::class;

    public function toArray(Request $request): array
    {
        return parent::toArray($request);
    }
}
