<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subscription>
 */
class SubscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'plan_id' => Plan::factory(),
            'starts_at' => now(),
            'ends_at' => now()->addYear(),
            'status' => $this->faker->randomElement(['active', 'canceled', 'expired']),
        ];
    }
}
