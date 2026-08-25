<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'content' => $this->faker->sentence(),
        ];
    }

    /**
     * Define o comentário como pertencente a um modelo específico.
     *
     * @param Model $model O modelo que será comentado (Post ou Recipe).
     * @return static
     */
    public function forCommentable(Model $model): static
    {
        return $this->state(fn(array $attributes) => [
            'commentable_id' => $model->id,
            'commentable_type' => $model->getMorphClass(),
        ]);
    }
}
