<?php

namespace Tests\Feature\Company;

use PHPUnit\Framework\Attributes\Test;

use App\Models\Company;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyListTest extends TestCase
{
    use CompanyTestSetup, RefreshDatabase;

    #[Test]
    public function Validar_UsuarioAutenticadoPodeListarEmpresas_Sucesso(): void
    {
        Company::factory(5)->create();

        $response = $this->actingAsRegularUser()->getJson('/api/companies');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'cnpj', 'email', 'phone', 'address', 'website', 'created_at'],
                ],
                'links',
                'meta',
            ]);
    }

    #[Test]
    public function Validar_ListagemDeEmpresasEhPaginada_Sucesso(): void
    {
        Company::factory(25)->create();

        $response = $this->actingAsRegularUser()->getJson('/api/companies?per_page=10');

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('meta.total', 25)
            ->assertJsonPath('meta.per_page', 10);
    }

    #[Test]
    public function Validar_ListagemDeEmpresasPodeSerFiltradaPorNome_Sucesso(): void
    {
        Company::factory()->create(['name' => 'My Awesome Company']);
        Company::factory(5)->create();

        $response = $this->actingAsRegularUser()->getJson('/api/companies?search=Awesome Company');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'My Awesome Company');
    }

    #[Test]
    public function Validar_UsuarioNaoAutenticadoNaoPodeListarEmpresas_ErroUnauthorized(): void
    {
        $response = $this->getJson('/api/companies');
        $response->assertStatus(401);
    }
}
