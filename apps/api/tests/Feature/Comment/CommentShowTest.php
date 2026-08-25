<?php

namespace Tests\Feature\Comment;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class CommentShowTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_QualquerUsuarioPodeVerUmComentarioEspecifico_Sucesso(): void
    {
        // Arrange
        $post = Post::factory()->create();
        $comment = Comment::factory()->forCommentable($post)->create();

        // Act
        $response = $this->getJson("/api/comments/{$comment->id}");

        // Assert
        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $comment->id);
    }
}
