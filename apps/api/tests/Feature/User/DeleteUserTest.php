<?php

namespace Tests\Feature\User;

use App\Models\Company;
use App\Models\Post;
use App\Models\User;
use App\Notifications\DeletedUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class DeleteUserTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function user_can_delete_their_own_account_and_it_is_anonymized_not_removed()
    {
        Notification::fake();

        $user = User::factory()->create(['name' => 'Maria Silva', 'email' => 'maria@example.com']);
        $user->createToken('test-token');
        $post = Post::factory()->create(['user_id' => $user->id, 'status' => Post::STATUS_PUBLISHED]);

        Sanctum::actingAs($user);

        $this->deleteJson("/api/users/{$user->id}")->assertStatus(204);

        $this->assertDatabaseHas('users', ['id' => $user->id]);
        $user->refresh();

        $this->assertEquals('Usuário Removido', $user->name);
        $this->assertNotEquals('maria@example.com', $user->email);
        $this->assertNull($user->phone);
        $this->assertNotNull($user->deleted_at);
        $this->assertCount(0, $user->tokens);

        $this->assertDatabaseHas('posts', ['id' => $post->id, 'user_id' => $user->id]);

        Notification::assertSentOnDemand(DeletedUser::class);
    }

    #[Test]
    public function deleting_an_account_scrubs_the_owned_company_and_rejects_pending_posts()
    {
        Notification::fake();

        $user = User::factory()->create();
        $company = Company::factory()->create(['user_id' => $user->id]);
        $pendingPost = Post::factory()->create([
            'user_id' => $user->id,
            'company_id' => $company->id,
            'status' => Post::STATUS_PENDING,
        ]);

        Sanctum::actingAs($user);

        $this->deleteJson("/api/users/{$user->id}")->assertStatus(204);

        $company->refresh();
        $pendingPost->refresh();

        $this->assertNull($company->cnpj);
        $this->assertStringContainsString('@temperinho.invalid', $company->email);
        $this->assertEquals(Post::STATUS_REJECTED, $pendingPost->status);
        $this->assertNotNull($pendingPost->rejection_reason);
    }

    #[Test]
    public function a_user_cannot_delete_someone_elses_account()
    {
        Sanctum::actingAs(User::factory()->create());

        $this->deleteJson('/api/users/' . User::factory()->create()->id)->assertForbidden();
    }
}
