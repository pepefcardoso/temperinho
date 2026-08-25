<?php

namespace Tests\Feature\Subscription;

use PHPUnit\Framework\Attributes\Test;

use App\Models\Company;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\User;
use App\Enum\RolesEnum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $user;
    protected Company $company;
    protected Plan $plan;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $this->user = User::factory()->create();
        $this->company = Company::factory()->create(['user_id' => $this->user->id]);
        $this->plan = Plan::factory()->create();
    }

    #[Test]
    public function Validar_AdminPodeCriarAssinatura_Sucesso(): void
    {
        Sanctum::actingAs($this->admin);

        $subscriptionData = [
            'company_id' => $this->company->id,
            'plan_id' => $this->plan->id,
            'starts_at' => now()->toIso8601String(),
            'ends_at' => now()->addYear()->toIso8601String(),
        ];

        $this->postJson('/api/subscriptions', $subscriptionData)
            ->assertStatus(201)
            ->assertJsonPath('data.company.id', $this->company->id);
    }

    #[Test]
    public function Validar_UsuarioPodeVisualizarAssinaturaDaSuaEmpresa_Sucesso(): void
    {
        Sanctum::actingAs($this->user);
        $subscription = Subscription::factory()->create(['company_id' => $this->company->id]);

        $this->getJson('/api/subscriptions/' . $subscription->id)
            ->assertOk()
            ->assertJsonPath('data.id', $subscription->id);
    }

    #[Test]
    public function Validar_UsuarioNaoPodeVisualizarAssinaturaDeOutraEmpresa_ErroForbidden(): void
    {
        Sanctum::actingAs($this->user);
        $otherCompany = Company::factory()->create();
        $subscription = Subscription::factory()->create(['company_id' => $otherCompany->id]);

        $this->getJson('/api/subscriptions/' . $subscription->id)
            ->assertForbidden();
    }
}
