<?php

namespace Tests\Feature\Post;

use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostUserActionsTest extends TestCase
{
    use RefreshDatabase, PostTestSetup;

    #[test]
    public function user_can_list_their_own_posts()
    {
        Sanctum::actingAs($this->user);
        Post::factory(3)->for($this->user)->create();
        Post::factory(2)->for($this->admin)->create();

        $this->getJson('/api/posts/my')
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    #[test]
    public function unauthenticated_user_cannot_list_their_posts()
    {
        $this->withHeaders(['Accept' => 'application/json'])
            ->getJson('/api/posts/my')
            ->assertUnauthorized();
    }

    #[test]
    public function user_can_list_their_favorite_posts()
    {
        Sanctum::actingAs($this->user);
        $posts = Post::factory(5)->create();
        $this->user->favoritePosts()->attach($posts->take(2)->pluck('id'));

        $this->getJson('/api/posts/favorites')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }
}
