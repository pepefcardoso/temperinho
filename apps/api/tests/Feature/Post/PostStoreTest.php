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

    protected function validPostData(): array
    {
        return [
            'title' => 'Meu Primeiro Post',
            'summary' => 'Este é o resumo.',
            'content' => 'Conteúdo completo e detalhado do post.',
            'category_id' => $this->category->id,
            'topics' => [$this->topic->id],
            'image' => UploadedFile::fake()->create('post-image.jpg', 100),
        ];
    }

    #[Test]
    public function internal_team_member_can_create_a_post()
    {
        Sanctum::actingAs($this->internal);

        $response = $this->postJson('/api/posts', $this->validPostData());

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Meu Primeiro Post');

        $this->assertDatabaseHas('posts', ['title' => 'Meu Primeiro Post']);
    }

    #[Test]
    public function sponsor_with_active_subscription_can_create_a_post()
    {
        Sanctum::actingAs($this->createSponsorWithActivePlan());

        $response = $this->postJson('/api/posts', $this->validPostData());

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Meu Primeiro Post');

        $this->assertDatabaseHas('posts', ['title' => 'Meu Primeiro Post']);
    }

    #[Test]
    public function regular_customer_without_a_company_cannot_create_a_post()
    {
        Sanctum::actingAs($this->user);

        $this->postJson('/api/posts', $this->validPostData())->assertForbidden();

        $this->assertDatabaseMissing('posts', ['title' => 'Meu Primeiro Post']);
    }

    #[Test]
    public function unauthenticated_user_cannot_create_a_post()
    {
        $this->postJson('/api/posts', [
            'title' => 'Post Fantasma',
            'summary' => 's',
            'content' => 'c',
            'category_id' => $this->category->id,
            'topics' => [$this->topic->id],
            'image' => UploadedFile::fake()->create('i.jpg'),
        ])->assertUnauthorized();
    }

    #[Test]
    public function store_post_request_is_validated()
    {
        Sanctum::actingAs($this->internal);

        $this->postJson('/api/posts', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'summary', 'content', 'category_id', 'topics', 'image']);
    }
}

