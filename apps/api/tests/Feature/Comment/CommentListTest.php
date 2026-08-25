<?php

namespace Tests\Feature\Comment;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Recipe;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class CommentListTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_QualquerUsuarioPodeListarComentariosDeUmPost_Sucesso(): void
    {
        // Arrange
        $post = Post::factory()->create();
        Comment::factory()->count(3)->forCommentable($post)->create();

        // Act
        // A rota deve ser '/api/posts/{id}/comments'
        $response = $this->getJson("/api/posts/{$post->id}/comments");

        // Assert
        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');
        $response->assertJsonStructure(['data' => [['id', 'content', 'author']]]);
    }

    #[Test]
    public function Validar_QualquerUsuarioPodeListarComentariosDeUmaReceita_Sucesso(): void
    {
        // Arrange
        $recipe = Recipe::factory()->create();
        Comment::factory()->count(2)->forCommentable($recipe)->create();

        // Act
        // A rota deve ser '/api/recipes/{id}/comments'
        $response = $this->getJson("/api/recipes/{$recipe->id}/comments");

        // Assert
        $response->assertStatus(200);
        $response->assertJsonCount(2, 'data');
    }
}
