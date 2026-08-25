<?php

namespace App\Http\Resources\Subscription;

use App\Http\Resources\Company\CompanyResource;
use App\Http\Resources\Plan\PlanResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'company_id' => $this->company_id,
            'plan_id' => $this->plan_id,
            'starts_at' => $this->starts_at->toIso8601String(),
            'ends_at' => $this->ends_at->toIso8601String(),
            'status' => $this->status,
            'created_at' => $this->created_at->toIso8601String(),
            'company' => new CompanyResource($this->whenLoaded('company')),
            'plan' => new PlanResource($this->whenLoaded('plan')),
        ];
    }
}
