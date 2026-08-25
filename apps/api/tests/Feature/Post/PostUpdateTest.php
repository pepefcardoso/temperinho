<?php

namespace Tests\Feature\Post;

use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostUpdateTest extends TestCase
{
    use RefreshDatabase, PostTestSetup;

    private function getPostPayload(Post $post): array
    {
        return [
            'title' => $post->title,
            'summary' => $post->summary,
            'content' => $post->content,
            'category_id' => $post->category_id,
            'topics' => $post->topics->pluck('id')->toArray(),
        ];
    }

    #[test]
    public function owner_can_update_their_own_post()
    {
        Sanctum::actingAs($this->user);
        $post = Post::factory()->for($this->user)->hasTopics(1)->create();

        $payload = $this->getPostPayload($post);
        $payload['title'] = 'Título do Post Atualizado';

        $this->putJson("/api/posts/{$post->id}", $payload)
            ->assertOk()
            ->assertJsonPath('data.title', 'Título do Post Atualizado');

        $this->assertDatabaseHas('posts', ['id' => $post->id, 'title' => 'Título do Post Atualizado']);
    }

    #[test]
    public function admin_can_update_any_post()
    {
        Sanctum::actingAs($this->admin);
        $post = Post::factory()->for($this->user)->hasTopics(1)->create();

        $payload = $this->getPostPayload($post);
        $payload['title'] = 'Atualizado pelo Admin';

        $this->putJson("/api/posts/{$post->id}", $payload)
            ->assertOk()
            ->assertJsonPath('data.title', 'Atualizado pelo Admin');
    }

    #[test]
    public function non_owner_cannot_update_a_post()
    {
        Sanctum::actingAs($this->user);
        $post = Post::factory()->create();

        $this->putJson("/api/posts/{$post->id}", ['title' => 'Tentativa de Invasão'])
            ->assertForbidden();
    }
}
