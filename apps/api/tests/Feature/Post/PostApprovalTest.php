<?php

namespace Tests\Feature\Post;

use App\Models\Post;
use App\Notifications\PostApproved;
use App\Notifications\PostRejected;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostApprovalTest extends TestCase
{
    use RefreshDatabase, PostTestSetup;

    protected function pendingPostFor($sponsor): Post
    {
        return Post::factory()->for($this->category, 'category')->create([
            'user_id' => $sponsor->id,
            'company_id' => $sponsor->company->id,
            'status' => Post::STATUS_PENDING,
        ]);
    }

    #[Test]
    public function admin_can_approve_a_pending_post()
    {
        Notification::fake();
        $sponsor = $this->createSponsorWithActivePlan();
        $post = $this->pendingPostFor($sponsor);

        Sanctum::actingAs($this->admin);

        $this->patchJson("/api/posts/{$post->id}/approve")
            ->assertOk()
            ->assertJsonPath('data.status', Post::STATUS_PUBLISHED);

        $this->assertDatabaseHas('posts', ['id' => $post->id, 'status' => Post::STATUS_PUBLISHED]);
        Notification::assertSentTo($sponsor, PostApproved::class);
    }

    #[Test]
    public function admin_can_reject_a_pending_post_with_a_reason()
    {
        Notification::fake();
        $sponsor = $this->createSponsorWithActivePlan();
        $post = $this->pendingPostFor($sponsor);

        Sanctum::actingAs($this->admin);

        $this->patchJson("/api/posts/{$post->id}/reject", ['reason' => 'Imagem em baixa resolução.'])
            ->assertOk()
            ->assertJsonPath('data.status', Post::STATUS_REJECTED);

        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'status' => Post::STATUS_REJECTED,
            'rejection_reason' => 'Imagem em baixa resolução.',
        ]);
        Notification::assertSentTo($sponsor, PostRejected::class);
    }

    #[Test]
    public function reject_requires_a_reason()
    {
        $sponsor = $this->createSponsorWithActivePlan();
        $post = $this->pendingPostFor($sponsor);

        Sanctum::actingAs($this->admin);

        $this->patchJson("/api/posts/{$post->id}/reject", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['reason']);
    }

    #[Test]
    public function non_admin_cannot_approve_a_post()
    {
        $sponsor = $this->createSponsorWithActivePlan();
        $post = $this->pendingPostFor($sponsor);

        Sanctum::actingAs($this->internal);

        $this->patchJson("/api/posts/{$post->id}/approve")->assertForbidden();
    }

    #[Test]
    public function pending_posts_are_excluded_from_the_public_listing_and_show()
    {
        $sponsor = $this->createSponsorWithActivePlan();
        $post = $this->pendingPostFor($sponsor);

        $this->getJson('/api/posts')->assertJsonMissing(['id' => $post->id]);
        $this->getJson("/api/posts/{$post->id}")->assertForbidden();
    }

    #[Test]
    public function sponsor_can_still_view_their_own_pending_post()
    {
        $sponsor = $this->createSponsorWithActivePlan();
        $post = $this->pendingPostFor($sponsor);

        Sanctum::actingAs($sponsor);

        $this->getJson("/api/posts/{$post->id}")->assertOk();
    }
}
