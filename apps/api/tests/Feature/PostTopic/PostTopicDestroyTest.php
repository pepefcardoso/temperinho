<?php

namespace Tests\Feature\PostTopic;

use App\Enum\RolesEnum;
use App\Models\PostTopic;
use App\Models\Post;
use App\Models\PostCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostTopicDestroyTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_AdminPodeDeletarTopicNaoUtilizado_ErroForbidden(): void
    {
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $topic = PostTopic::factory()->create();
        Sanctum::actingAs($admin);

        $response = $this->deleteJson("/api/post-topics/{$topic->id}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('post_topics', ['id' => $topic->id]);
    }

    #[Test]
    public function Validar_AdminNaoPodeDeletarTopicEmUso_ErroForbidden(): void
    {
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $topic = PostTopic::factory()->create();

        // Cria categoria e autor para o post
        $category = PostCategory::factory()->create();
        $author   = User::factory()->create();

        // Cria o post referenciando category_id e user_id
        $post = Post::factory()->create([
            'category_id' => $category->id,
            'user_id'     => $author->id,
        ]);

        // Anexa o topic ao post
        $post->topics()->attach($topic->id);

        Sanctum::actingAs($admin);

        $response = $this->deleteJson("/api/post-topics/{$topic->id}");
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['topic']);
        $this->assertDatabaseHas('post_topics', ['id' => $topic->id]);
    }

    #[Test]
    public function Validar_ClienteNaoPodeDeletarTopic_ErroForbidden(): void
    {
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $topic = PostTopic::factory()->create();
        Sanctum::actingAs($customer);

        $response = $this->deleteJson("/api/post-topics/{$topic->id}");
        $response->assertStatus(403);
    }
}
