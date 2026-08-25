<?php

namespace Tests\Feature\Rating;

use PHPUnit\Framework\Attributes\Test;

use App\Models\Post;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RatingUpdateTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_DonoPodeAtualizarAvaliacao_Sucesso(): void
    {
        $post = Post::factory()->create();
        $rating = Rating::factory()->forRateable($post)->create();
        Sanctum::actingAs($rating->user);

        $response = $this->putJson("/api/ratings/{$rating->id}", ['rating' => 2]);

        $response->assertStatus(200)
            ->assertJsonPath('data.rating', 2);

        $this->assertDatabaseHas('ratings', ['id' => $rating->id, 'rating' => 2]);
    }

    #[Test]
    public function Validar_NaoDonoNaoPodeAtualizarAvaliacao_ErroForbidden(): void
    {
        $post = Post::factory()->create();
        $rating = Rating::factory()->forRateable($post)->create();
        $other = User::factory()->create();
        Sanctum::actingAs($other);

        $response = $this->putJson("/api/ratings/{$rating->id}", ['rating' => 3]);
        $response->assertStatus(403);
    }
}
