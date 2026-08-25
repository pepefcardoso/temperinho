<?php

namespace Tests\Feature\User;

use App\Enum\RolesEnum;
use App\Models\Post;
use App\Models\Recipe;
use App\Models\User;
use App\Notifications\DeletedUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class UserActionsTest extends TestCase
{
    use RefreshDatabase;

    // --- Testes para destroy ---

    #[Test]
    public function Validar_AdminPodeDeletarOutroUsuario_Sucesso(): void
    {
        // Arrange
        Notification::fake();
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $customer = User::factory()->create();
        Sanctum::actingAs($admin);

        // Act
        $response = $this->deleteJson("/api/users/{$customer->id}");

        // Assert
        $response->assertStatus(204);
        $this->assertDatabaseMissing('users', ['id' => $customer->id]);

        // CORREÇÃO: Use assertSentOnDemand para verificar notificações "On-Demand"
        Notification::assertSentOnDemand(DeletedUser::class);
    }

    #[Test]
    public function Validar_UsuarioPodeDeletarAPropriaConta_Sucesso(): void
    {
        // Arrange
        Notification::fake();
        $customer = User::factory()->create();
        Sanctum::actingAs($customer);

        // Act
        $response = $this->deleteJson("/api/users/{$customer->id}");

        // Assert
        $response->assertStatus(204);
        $this->assertDatabaseMissing('users', ['id' => $customer->id]);

        // CORREÇÃO: Use assertSentOnDemand aqui também para consistência
        Notification::assertSentOnDemand(DeletedUser::class);
    }

    #[Test]
    public function Validar_UsuarioNaoPodeDeletarOutraConta_ErroForbidden(): void
    {
        // Arrange
        $customerA = User::factory()->create();
        $customerB = User::factory()->create();
        Sanctum::actingAs($customerA);

        // Act
        $response = $this->deleteJson("/api/users/{$customerB->id}");

        // Assert
        $response->assertStatus(403);
    }

    // --- Teste para authUser ---

    #[Test]
    public function Validar_UsuarioAutenticadoPodeBuscarSeusPropriosDados_Sucesso(): void
    {
        // Arrange
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Act
        $response = $this->getJson('/api/users/me');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $user->id);
        $response->assertJsonPath('data.email', $user->email);
    }

    // --- Testes para updateRole ---

    #[Test]
    public function Validar_AdminPodeAtualizarARoleDeUmUsuario_Sucesso(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($admin);

        $updateData = [
            'user_id' => $customer->id,
            'role' => RolesEnum::INTERNAL->value,
        ];

        $response = $this->patchJson("/api/users/{$customer->id}/role", $updateData);

        // Assert
        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'id' => $customer->id,
            'role' => RolesEnum::INTERNAL->value
        ]);
        $response->assertJsonPath('data.role', RolesEnum::INTERNAL->name);
    }

    #[Test]
    public function Validar_ClienteNaoPodeAtualizarARoleDeUmUsuario_ErroForbidden(): void
    {
        // Arrange
        $customerA = User::factory()->create();
        $customerB = User::factory()->create();
        Sanctum::actingAs($customerA);

        // Act
        $response = $this->patchJson("/api/users/{$customerB->id}/role", [
            'user_id' => $customerB->id,
            'role' => RolesEnum::ADMIN->value,
        ]);

        // Assert
        $response->assertStatus(403);
    }

    // --- Testes para toggleFavorite ---

    #[Test]
    public function Validar_UsuarioPodeFavoritarEDesfavoritarUmPost_Sucesso(): void
    {
        // Arrange
        $user = User::factory()->create();
        $post = Post::factory()->create();
        Sanctum::actingAs($user);

        // Act & Assert 1: Favorite
        $this->postJson('/api/users/favorites/posts', ['post_id' => $post->id])
            ->assertStatus(200);
        $this->assertDatabaseHas('rl_user_favorite_posts', ['user_id' => $user->id, 'post_id' => $post->id]);

        // Act & Assert 2: Unfavorite
        $this->postJson('/api/users/favorites/posts', ['post_id' => $post->id])
            ->assertStatus(200);
        $this->assertDatabaseMissing('rl_user_favorite_posts', ['user_id' => $user->id, 'post_id' => $post->id]);
    }

    #[Test]
    public function Validar_UsuarioPodeFavoritarEDesfavoritarUmaReceita_Sucesso(): void
    {
        // Arrange
        $user = User::factory()->create();
        $recipe = Recipe::factory()->create();
        Sanctum::actingAs($user);

        // Act & Assert 1: Favorite
        $this->postJson('/api/users/favorites/recipes', ['recipe_id' => $recipe->id])
            ->assertStatus(200);
        $this->assertDatabaseHas('rl_user_favorite_recipes', ['user_id' => $user->id, 'recipe_id' => $recipe->id]);

        // Act & Assert 2: Unfavorite
        $this->postJson('/api/users/favorites/recipes', ['recipe_id' => $recipe->id])
            ->assertStatus(200);
        $this->assertDatabaseMissing('rl_user_favorite_recipes', ['user_id' => $user->id, 'recipe_id' => $recipe->id]);
    }
}
