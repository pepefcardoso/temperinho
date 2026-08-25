<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Recipe;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Database\Seeder;

class RatingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = Post::all();
        $recipes = Recipe::all();
        $rateables = collect([...$posts, ...$recipes]);
        $users = User::all();

        if ($users->isEmpty() || $rateables->isEmpty()) {
            return;
        }

        foreach ($rateables as $rateable) {
            $numberOfRatings = rand(1, min(5, $users->count()));
            $ratingUsers = $users->random($numberOfRatings)->unique('id');

            foreach ($ratingUsers as $user) {
                Rating::factory()
                    ->for($user)
                    ->forRateable($rateable)
                    ->create();
            }
        }
    }
}
