<?php

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Plan>
 */
class PlanFactory extends Factory
{
    /**
     * O modelo que esta factory deve usar.
     *
     * @var string
     */
    protected $model = Plan::class;

    /**
     * Define o estado padrão do modelo.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $displayOrder = 1;

        return [
            'name' => 'Plano ' . $this->faker->unique()->word(),
            'badge' => $this->faker->optional(0.3)->randomElement(['Mais Popular', 'Melhor Custo-Benefício']),
            'price' => $this->faker->randomElement([990, 1990, 2990, 4990]),
            'period' => $this->faker->randomElement(['monthly', 'yearly']),
            'description' => $this->faker->sentence(12),
            'features' => [
                $this->faker->words(3, true),
                $this->faker->words(4, true),
                $this->faker->words(3, true),
            ],
            'status' => $this->faker->randomElement(['active', 'active', 'active', 'draft', 'archived']),
            'display_order' => $displayOrder++,
            'max_users' => $this->faker->randomElement([1, 5, 10, null]),
            'max_posts' => $this->faker->randomElement([10, 50, 100, null]),
            'max_recipes' => $this->faker->randomElement([10, 50, 100, null]),
            'max_banners' => $this->faker->randomElement([2, 5, null]),
            'max_email_campaigns' => $this->faker->randomElement([5, 10, 20, null]),
            'newsletter' => $this->faker->boolean(80),
            'trial_days' => $this->faker->randomElement([0, 7, 15]),
        ];
    }
}