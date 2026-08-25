<?php

namespace Tests\Feature\Post;

use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostStoreTest extends TestCase
{
    use RefreshDatabase, PostTestSetup;

    #[test]
    public function authenticated_user_can_create_a_post()
    {
        Sanctum::actingAs($this->user);

        $postData = [
            'title' => 'Meu Primeiro Post',
            'summary' => 'Este é o resumo.',
            'content' => 'Conteúdo completo e detalhado do post.',
            'category_id' => $this->category->id,
            'topics' => [$this->topic->id],
            'image' => UploadedFile::fake()->create('post-image.jpg', 100), // 100 kilobits
        ];

        $response = $this->postJson('/api/posts', $postData);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Meu Primeiro Post')
            ->assertJsonPath('data.author.id', $this->user->id);

        $this->assertDatabaseHas('posts', ['title' => 'Meu Primeiro Post']);
        $this->assertDatabaseHas('images', ['imageable_type' => Post::class, 'imageable_id' => $response->json('data.id')]);
        Storage::disk('s3')->assertExists(Post::first()->image->path);
    }

    #[test]
    public function unauthenticated_user_cannot_create_a_post()
    {
        $postData = [
            'title' => 'Post Fantasma',
            'summary' => 's',
            'content' => 'c',
            'category_id' => $this->category->id,
            'topics' => [$this->topic->id],
            'image' => UploadedFile::fake()->create('i.jpg')
        ];

        $this->postJson('/api/posts', $postData)
            ->assertUnauthorized();
    }

    #[test]
    public function store_post_request_is_validated()
    {
        Sanctum::actingAs($this->user);

        $this->postJson('/api/posts', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'summary', 'content', 'category_id', 'topics', 'image']);
    }
}

