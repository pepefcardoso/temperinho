<?php

namespace App\Http\Resources\Plan;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'badge' => $this->badge,
            'price' => number_format($this->price / 100, 2, ',', '.'),
            'period' => $this->period === 'monthly' ? 'Mensal' : 'Anual',
            'description' => $this->description,
            'features' => $this->features,
            'status' => $this->status,
            'display_order' => $this->display_order,
            'limits' => [
                'users' => $this->max_users,
                'posts' => $this->max_posts,
                'recipes' => $this->max_recipes,
                'banners' => $this->max_banners,
                'email_campaigns' => $this->max_email_campaigns,
            ],
            'newsletter' => $this->newsletter,
            'is_popular' => $this->is_popular,
            'trial_days' => $this->trial_days,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
