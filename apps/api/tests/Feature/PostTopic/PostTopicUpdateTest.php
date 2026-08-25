<?php
// tests/Feature/PostTopic/PostTopicUpdateTest.php

namespace Tests\Feature\PostTopic;

use App\Enum\RolesEnum;
use App\Models\PostTopic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostTopicUpdateTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_AdminPodeAtualizarTopic_Sucesso(): void
    {
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $topic = PostTopic::factory()->create(['name' => 'Old']);
        Sanctum::actingAs($admin);

        $response = $this->putJson("/api/post-topics/{$topic->id}", ['name' => 'Updated']);
        $response->assertStatus(200);
        $this->assertDatabaseHas('post_topics', [
            'id' => $topic->id,
            'name' => 'Updated',
        ]);
        $response->assertJsonPath('data.name', 'Updated');
    }

    #[Test]
    public function Validar_ClienteNaoPodeAtualizarTopic_ErroForbidden(): void
    {
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $topic = PostTopic::factory()->create();
        Sanctum::actingAs($customer);

        $response = $this->putJson("/api/post-topics/{$topic->id}", ['name' => 'Fail']);
        $response->assertStatus(403);
    }
}
