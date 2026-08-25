<?php

namespace Tests\Feature\Company;

use PHPUnit\Framework\Attributes\Test;

use App\Models\Company;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyDestroyTest extends TestCase
{
    use CompanyTestSetup, RefreshDatabase;

    #[Test]
    public function Validar_AdminPodeExcluirEmpresa_Sucesso(): void
    {
        $company = Company::factory()->create();

        $response = $this->actingAsAdmin()->deleteJson("/api/companies/{$company->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('companies', ['id' => $company->id]);
    }

    #[Test]
    public function Validar_UsuarioCriadorPodeExcluirEmpresa_Sucesso(): void
    {
        $company = Company::factory()->create(['user_id' => $this->regularUser->id]);

        $response = $this->actingAsRegularUser()->deleteJson("/api/companies/{$company->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('companies', ['id' => $company->id]);
    }

    #[Test]
    public function Validar_UsuarioNaoAutorizadoNaoPodeExcluirEmpresa_ErroForbidden(): void
    {
        $anotherUser = \App\Models\User::factory()->create();
        $company = Company::factory()->create(['user_id' => $anotherUser->id]);

        $response = $this->actingAsRegularUser()->deleteJson("/api/companies/{$company->id}");

        $response->assertStatus(403);
    }
}
