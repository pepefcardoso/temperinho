<?php
// tests/Feature/PostTopic/PostTopicStoreTest.php

namespace Tests\Feature\PostTopic;

use App\Enum\RolesEnum;
use App\Models\PostTopic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostTopicStoreTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_AdminPodeCriarNovoTopic_Sucesso(): void
    {
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        Sanctum::actingAs($admin);

        $name = 'Novo Topic';
        $response = $this->postJson('/api/post-topics', ['name' => $name]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('post_topics', [
            'name' => $name,
            'normalized_name' => Str::upper($name),
        ]);
        $response->assertJsonPath('data.name', $name);
    }

    #[Test]
    public function Validar_ClienteNaoPodeCriarTopic_ErroForbidden(): void
    {
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($customer);

        $response = $this->postJson('/api/post-topics', ['name' => 'Falha']);
        $response->assertStatus(403);
    }

    #[Test]
    public function Validar_CriarTopicComNomeDuplicadoRetornaErroValidacao_ErroDeValidacao(): void
    {
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $existing = PostTopic::factory()->create();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/post-topics', ['name' => $existing->name]);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    #[Test]
    public function Validar_NaoAutenticadoNaoPodeCriarTopic_ErroUnauthorized(): void
    {
        $response = $this->postJson('/api/post-topics', ['name' => 'SemAuth']);
        $response->assertStatus(401);
    }
}
