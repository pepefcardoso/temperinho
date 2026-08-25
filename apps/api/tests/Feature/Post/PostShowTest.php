<?php

namespace Tests\Feature\Post;

use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostShowTest extends TestCase
{
    use RefreshDatabase, PostTestSetup;

    #[test]
    public function anyone_can_view_a_published_post()
    {
        Post::withoutEvents(function () use (&$post) {
            $post = Post::factory()
                ->for($this->category, 'category')
                ->create();
        });

        $this->getJson("/api/posts/{$post->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $post->id)
            ->assertJsonPath('data.title', $post->title)
            ->assertJsonCount($post->topics->count(), 'data.topics')
            ->assertJsonStructure(['data' => ['id', 'title', 'summary', 'content', 'image', 'author', 'category', 'topics']]);
    }

    #[test]
    public function it_returns_404_if_post_does_not_exist()
    {
        $this->getJson('/api/posts/9999')->assertNotFound();
    }
}
