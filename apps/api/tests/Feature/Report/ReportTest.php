<?php

namespace Tests\Feature\Report;

use App\Enum\RolesEnum;
use App\Models\Comment;
use App\Models\Rating;
use App\Models\Recipe;
use App\Models\Report;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ReportTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function authenticated_user_can_report_a_comment()
    {
        $reporter = User::factory()->create();
        $comment = Comment::factory()->create();

        Sanctum::actingAs($reporter);

        $this->postJson("/api/comments/{$comment->id}/reports", [
            'reason' => 'spam',
            'comment' => 'Isso é propaganda.',
        ])->assertStatus(201)
            ->assertJsonPath('data.status', 'pending');

        $this->assertDatabaseHas('reports', [
            'reportable_type' => Comment::class,
            'reportable_id' => $comment->id,
            'user_id' => $reporter->id,
            'reason' => 'spam',
        ]);
    }

    #[Test]
    public function authenticated_user_can_report_a_rating_and_a_recipe()
    {
        Sanctum::actingAs(User::factory()->create());

        $this->postJson('/api/ratings/' . Rating::factory()->create()->id . '/reports', ['reason' => 'other'])
            ->assertStatus(201);

        $this->postJson('/api/recipes/' . Recipe::factory()->create()->id . '/reports', ['reason' => 'misinformation'])
            ->assertStatus(201);

        $this->assertDatabaseCount('reports', 2);
    }

    #[Test]
    public function reason_must_be_a_valid_option()
    {
        $comment = Comment::factory()->create();
        Sanctum::actingAs(User::factory()->create());

        $this->postJson("/api/comments/{$comment->id}/reports", ['reason' => 'nao_existe'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['reason']);
    }

    #[Test]
    public function unauthenticated_user_cannot_report_content()
    {
        $comment = Comment::factory()->create();

        $this->postJson("/api/comments/{$comment->id}/reports", ['reason' => 'spam'])
            ->assertUnauthorized();
    }

    #[Test]
    public function only_internal_users_can_list_reports()
    {
        Report::factory()->count(3)->create();

        Sanctum::actingAs(User::factory()->create(['role' => RolesEnum::CUSTOMER]));
        $this->getJson('/api/reports')->assertForbidden();

        Sanctum::actingAs(User::factory()->create(['role' => RolesEnum::ADMIN]));
        $this->getJson('/api/reports')->assertOk()->assertJsonCount(3, 'data');
    }

    #[Test]
    public function only_internal_users_can_mark_a_report_as_reviewed()
    {
        $report = Report::factory()->create(['status' => Report::STATUS_PENDING]);

        Sanctum::actingAs(User::factory()->create(['role' => RolesEnum::CUSTOMER]));
        $this->patchJson("/api/reports/{$report->id}/review")->assertForbidden();

        Sanctum::actingAs(User::factory()->create(['role' => RolesEnum::ADMIN]));
        $this->patchJson("/api/reports/{$report->id}/review")
            ->assertOk()
            ->assertJsonPath('data.status', Report::STATUS_REVIEWED);

        $this->assertDatabaseHas('reports', ['id' => $report->id, 'status' => Report::STATUS_REVIEWED]);
    }
}
