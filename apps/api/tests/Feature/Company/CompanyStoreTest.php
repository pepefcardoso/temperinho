<?php

namespace Tests\Feature\Company;

use PHPUnit\Framework\Attributes\Test;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyStoreTest extends TestCase
{
    use CompanyTestSetup, RefreshDatabase;

    #[Test]
    public function Validar_AdminPodeCriarEmpresa_Sucesso(): void
    {
        $companyData = [
            'name' => 'New Tech Inc.',
            'cnpj' => '99.073.876/0001-28',
            'email' => 'contact@newtech.com',
            'phone' => '11987654321',
            'address' => '456 Innovation Ave',
            'website' => 'https://newtech.com',
        ];

        $response = $this->actingAsAdmin()->postJson('/api/companies', $companyData);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'New Tech Inc.']);

        $this->assertDatabaseHas('companies', ['name' => 'New Tech Inc.', 'user_id' => $this->adminUser->id]);
    }

    #[Test]
    public function Validar_UsuarioComumNaoPodeCriarEmpresa_ErroForbidden(): void
    {
        $companyData = \App\Models\Company::factory()->make()->toArray();
        $response = $this->actingAsRegularUser()->postJson('/api/companies', $companyData);
        $response->assertStatus(403);
    }

    #[Test]
    public function Validar_CriacaoDeEmpresaFalhaComDadosFaltando_ErroDeValidacao(): void
    {
        $response = $this->actingAsAdmin()->postJson('/api/companies', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'cnpj', 'email', 'phone', 'address', 'website']);
    }
}
