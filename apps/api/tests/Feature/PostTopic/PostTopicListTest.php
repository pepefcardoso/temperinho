<?php
// tests/Feature/PostTopic/PostTopicListTest.php

namespace Tests\Feature\PostTopic;

use App\Models\PostTopic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PostTopicListTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_EndpointIndexRetornaListaDeTopics_Sucesso(): void
    {
        PostTopic::factory()->count(3)->create();

        $response = $this->getJson('/api/post-topics');

        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
        $response->assertJsonStructure([
            'data' => ['*' => ['id', 'name']]
        ]);
    }

    #[Test]
    public function Validar_EndpointIndexRetornaArrayVazioSeNaoHaTopics_ErroForbidden(): void
    {
        $response = $this->getJson('/api/post-topics');

        $response->assertStatus(200);
        $response->assertJsonCount(0, 'data');
    }
}
