<?php

namespace App\Http\Resources\Company;

use App\Http\Resources\Image\ImageResource;
use App\Http\Resources\Subscription\SubscriptionResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'cnpj' => $this->cnpj,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'website' => $this->website,
            'image' => new ImageResource($this->whenLoaded('image')),
            'user' => $this->user_id,
            'created_at' => $this->created_at->toDateTimeString(),
            'subscriptions' => SubscriptionResource::collection($this->whenLoaded('subscriptions')),
        ];
    }
}
