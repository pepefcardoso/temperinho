<?php

namespace Tests\Feature\Post;

use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostDestroyTest extends TestCase
{
    use RefreshDatabase, PostTestSetup;

    #[test]
    public function owner_can_delete_their_own_post()
    {
        Sanctum::actingAs($this->user);
        $post = Post::factory()->for($this->user)->create();

        $this->deleteJson("/api/posts/{$post->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    #[test]
    public function non_owner_cannot_delete_a_post()
    {
        Sanctum::actingAs($this->user);
        $post = Post::factory()->create();

        $this->deleteJson("/api/posts/{$post->id}")
            ->assertForbidden();
    }

    #[test]
    public function admin_can_delete_any_post()
    {
        Sanctum::actingAs($this->admin);
        $post = Post::factory()->for($this->user)->create();

        $this->deleteJson("/api/posts/{$post->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }
}
