<?php

namespace Tests\Feature\Company;

use PHPUnit\Framework\Attributes\Test;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyUpdateTest extends TestCase
{
    use CompanyTestSetup, RefreshDatabase;

    #[Test]
    public function Validar_AdminPodeAtualizarQualquerEmpresa_Sucesso(): void
    {
        $company = Company::factory()->create(['user_id' => $this->regularUser->id]);
        $updateData = ['name' => 'Updated by Admin'];

        $response = $this->actingAsAdmin()->putJson("/api/companies/{$company->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Updated by Admin']);

        $this->assertDatabaseHas('companies', ['id' => $company->id, 'name' => 'Updated by Admin']);
    }

    #[Test]
    public function Validar_UsuarioCriadorPodeAtualizarEmpresa_Sucesso(): void
    {
        $company = Company::factory()->create(['user_id' => $this->regularUser->id]);
        $updateData = ['name' => 'Updated by Owner'];

        $response = $this->actingAsRegularUser()->putJson("/api/companies/{$company->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Updated by Owner']);
    }

    #[Test]
    public function Validar_UsuarioNaoAutorizadoNaoPodeAtualizarEmpresa_ErroForbidden(): void
    {
        $anotherUser = User::factory()->create();
        $company = Company::factory()->create(['user_id' => $anotherUser->id]);
        $updateData = ['name' => 'This Should Not Work'];

        $response = $this->actingAsRegularUser()->putJson("/api/companies/{$company->id}", $updateData);

        $response->assertStatus(403);
    }
}
