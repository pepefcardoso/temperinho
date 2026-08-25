<?php

namespace Tests\Feature\Subscription;

use App\Models\Company;
use App\Models\Plan;
use App\Models\Post;
use App\Models\Recipe;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PlanLimitTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_CriacaoDePostSemAssinaturaAtiva_ErroForbidden(): void
    {
        // --- ARRANGE ---
        Storage::fake('s3');
        $user = User::factory()->create();
        Company::factory()->create(['user_id' => $user->id]);
        
        $data = Post::factory()->raw();

        // --- ACT ---
        Sanctum::actingAs($user);
        $response = $this->postJson('/api/posts', $data);

        // --- ASSERT ---
        $response->assertStatus(403)
            ->assertJsonPath('message', 'Sua empresa não possui um plano ativo. Por favor, contate o suporte.');
    }

    #[Test]
    public function Validar_CriacaoDePostDentroDoLimite_Sucesso(): void
    {
        // --- ARRANGE ---
        Storage::fake('s3');
        $user = User::factory()->create();
        $company = Company::factory()->create(['user_id' => $user->id]);
        $plan = Plan::factory()->create(['max_posts' => 1]);
        Subscription::factory()->create([
            'company_id' => $company->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'ends_at' => now()->addMonth(),
        ]);
        
        $data = Post::factory()->raw();

        // --- ACT ---
        Sanctum::actingAs($user);
        $response = $this->postJson('/api/posts', $data);

        // --- ASSERT ---
        $response->assertStatus(422);
    }

    #[Test]
    public function Validar_CriacaoDePostExcedendoLimite_ErroForbidden(): void
    {
        // --- ARRANGE ---
        Storage::fake('s3');
        $user = User::factory()->create();
        $company = Company::factory()->create(['user_id' => $user->id]);
        $plan = Plan::factory()->create(['max_posts' => 1]);
        Subscription::factory()->create([
            'company_id' => $company->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'ends_at' => now()->addMonth(),
        ]);
        
        Post::factory()->create([
            'company_id' => $company->id,
            'user_id' => $user->id,
            'created_at' => now()->subDays(5),
        ]);
        
        $data = Post::factory()->raw();

        // --- ACT ---
        Sanctum::actingAs($user);
        $response = $this->postJson('/api/posts', $data);

        // --- ASSERT ---
        $response->assertStatus(403)
            ->assertJsonPath('message', 'Você atingiu o limite mensal de posts do seu plano.');
    }

    #[Test]
    public function Validar_CriacaoDeRecipeDentroDoLimite_Sucesso(): void
    {
        // --- ARRANGE ---
        Storage::fake('s3');
        $user = User::factory()->create();
        $company = Company::factory()->create(['user_id' => $user->id]);
        $plan = Plan::factory()->create(['max_recipes' => 1]);
        Subscription::factory()->create([
            'company_id' => $company->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'ends_at' => now()->addMonth(),
        ]);
        
        $data = Recipe::factory()->raw();

        // --- ACT ---
        Sanctum::actingAs($user);
        $response = $this->postJson('/api/recipes', $data);

        // --- ASSERT ---
        $response->assertStatus(422);
    }

    #[Test]
    public function Validar_CriacaoDeRecipeExcedendoLimite_ErroForbidden(): void
    {
        // --- ARRANGE ---
        Storage::fake('s3');
        $user = User::factory()->create();
        $company = Company::factory()->create(['user_id' => $user->id]);
        $plan = Plan::factory()->create(['max_recipes' => 1]);
        Subscription::factory()->create([
            'company_id' => $company->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'ends_at' => now()->addMonth(),
        ]);
        
        Recipe::factory()->create([
            'company_id' => $company->id,
            'user_id' => $user->id,
            'created_at' => now()->subDays(5),
        ]);
        
        $data = Recipe::factory()->raw();

        // --- ACT ---
        Sanctum::actingAs($user);
        $response = $this->postJson('/api/recipes', $data);

        // --- ASSERT ---
        $response->assertStatus(403)
            ->assertJsonPath('message', 'Você atingiu o limite mensal de recipes do seu plano.');
    }
}
