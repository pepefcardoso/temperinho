<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Recipe;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = Post::all();
        $recipes = Recipe::all();
        $commentables = collect([...$posts, ...$recipes]);

        $users = User::all();

        if ($users->isEmpty() || $commentables->isEmpty()) {
            return;
        }

        foreach ($commentables as $commentable) {
            Comment::factory()
                ->count(rand(1, 5))
                ->forCommentable($commentable)
                ->create(['user_id' => $users->random()->id]);
        }
    }
}
