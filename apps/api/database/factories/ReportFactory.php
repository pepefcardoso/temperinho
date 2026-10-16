<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReportFactory extends Factory
{
    protected $model = Report::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'reportable_id' => Comment::factory(),
            'reportable_type' => Comment::class,
            'reason' => $this->faker->randomElement(Report::REASONS),
            'comment' => $this->faker->optional()->sentence(),
            'status' => Report::STATUS_PENDING,
        ];
    }
}
