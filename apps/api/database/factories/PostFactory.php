<?php

namespace Database\Factories;

use App\Models\PostCategory;
use App\Models\PostTopic;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'summary' => $this->faker->sentence(),
            'content' => $this->faker->paragraph(),
            'category_id' => PostCategory::factory(),
            'user_id' => User::factory(),
        ];
    }

    /**
     * Configure the factory.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function configure()
    {
        return $this->afterCreating(function ($post) {
            if (PostTopic::query()->exists()) {
                $topics = PostTopic::inRandomOrder()->take(rand(1, 3))->pluck('id');
                $post->topics()->sync($topics);
            }
        });
    }
}
