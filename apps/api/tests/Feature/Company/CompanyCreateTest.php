<?php

namespace Tests\Feature\Company;

use App\Enum\RolesEnum;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class CompanyCreateTest extends TestCase
{
    use RefreshDatabase;

    protected function validCompanyData(): array
    {
        return [
            'name' => 'Marca Exemplo',
            'cnpj' => '12345678000199',
            'email' => 'contato@marcaexemplo.com.br',
            'phone' => '48999990000',
            'address' => 'Rua Exemplo, 123',
            'website' => 'https://marcaexemplo.com.br',
        ];
    }

    #[Test]
    public function a_regular_customer_without_a_company_can_self_register_one()
    {
        Storage::fake('s3');

        Sanctum::actingAs(User::factory()->create(['role' => RolesEnum::CUSTOMER]));

        $this->postJson('/api/companies', $this->validCompanyData())
            ->assertStatus(201)
            ->assertJsonPath('data.name', 'Marca Exemplo');

        $this->assertDatabaseHas('companies', ['email' => 'contato@marcaexemplo.com.br']);
    }

    #[Test]
    public function a_user_who_already_owns_a_company_cannot_create_a_second_one()
    {
        Storage::fake('s3');

        $user = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        \App\Models\Company::factory()->create(['user_id' => $user->id]);

        Sanctum::actingAs($user);

        $this->postJson('/api/companies', $this->validCompanyData())
            ->assertForbidden();
    }

    #[Test]
    public function internal_users_can_still_create_a_company()
    {
        Storage::fake('s3');

        Sanctum::actingAs(User::factory()->create(['role' => RolesEnum::INTERNAL]));

        $this->postJson('/api/companies', $this->validCompanyData())
            ->assertStatus(201);
    }
}
