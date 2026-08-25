<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\PostCategory;
use App\Models\PostTopic;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF;');
        } elseif ($driver === 'pgsql') {
            DB::statement("SET session_replication_role = 'replica';");
        }

        Post::truncate();

        if ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON;');
        } elseif ($driver === 'pgsql') {
            DB::statement("SET session_replication_role = 'origin';");
        }

        $author = User::first();
        if (!$author) {
            $this->command->info('Nenhum usuário encontrado. Crie um usuário antes de executar o PostSeeder.');
            return;
        }

        $jsonPath = database_path('seeders/data/posts.json');
        if (!File::exists($jsonPath)) {
            $this->command->error('Arquivo posts.json não encontrado!');
            return;
        }

        $json = File::get($jsonPath);
        $postsData = json_decode($json, true);

        foreach ($postsData as $postItem) {
            $category = PostCategory::where('name', $postItem['category_name'])->firstOrFail();
            $topicIds = PostTopic::whereIn('name', $postItem['topic_names'])->pluck('id');

            $postToCreate = [
                'title' => $postItem['title'],
                'summary' => $postItem['summary'],
                'content' => $postItem['content'],
                'category_id' => $category->id,
                'user_id' => $author->id,
            ];

            $post = Post::create($postToCreate);
            $post->topics()->attach($topicIds);
        }
    }
}
