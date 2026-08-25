<?php

namespace App\Http\Resources\Plan;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanCollectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id' => $this->id, 'name' => $this->name, 'price' => number_format($this->price / 100, 2, ',', '.'), 'period' => $this->period === 'monthly' ? 'Mensal' : 'Anual', 'status' => $this->status];
    }
}
