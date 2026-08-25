<?php

namespace Database\Factories;

use App\Models\Rating;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;

class RatingFactory extends Factory
{
    protected $model = Rating::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'rating' => $this->faker->numberBetween(1, 5)
        ];
    }

    /**
     * Indica a qual modelo a avaliação pertence.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @return static
     */
    public function forRateable(Model $model): static
    {
        return $this->state(fn(array $attrs) => [
            'rateable_id' => $model->id,
            'rateable_type' => $model->getMorphClass(),
        ]);
    }
}
