<?php

namespace Tests\Feature\Company;

use PHPUnit\Framework\Attributes\Test;

use App\Models\Company;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyShowTest extends TestCase
{
    use CompanyTestSetup, RefreshDatabase;

    #[Test]
    public function Validar_UsuarioAutenticadoPodeVisualizarEmpresa_Sucesso(): void
    {
        $company = Company::factory()->create();

        $response = $this->actingAsRegularUser()->getJson("/api/companies/{$company->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $company->id,
                    'name' => $company->name,
                    'email' => $company->email,
                ],
            ]);
    }

    #[Test]
    public function Validar_VisualizacaoRetorna404ParaEmpresaInexistente_ErroNotFound(): void
    {
        $response = $this->actingAsRegularUser()->getJson('/api/companies/999');
        $response->assertStatus(404);
    }

    #[Test]
    public function Validar_UsuarioNaoAutenticadoNaoPodeVisualizarEmpresa_ErroUnauthorized(): void
    {
        $company = Company::factory()->create();
        $response = $this->getJson("/api/companies/{$company->id}");
        $response->assertStatus(401);
    }
}
