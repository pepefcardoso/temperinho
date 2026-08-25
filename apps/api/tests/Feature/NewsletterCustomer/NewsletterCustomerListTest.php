<?php

namespace Tests\Feature\NewsletterCustomer;

use App\Enum\RolesEnum;
use App\Models\NewsletterCustomer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class NewsletterCustomerListTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_AdminPodeListarInscritos_Sucesso(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        NewsletterCustomer::factory()->count(5)->create();
        Sanctum::actingAs($admin);

        // Act
        $response = $this->getJson('/api/newsletter');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonCount(5, 'data');
    }

    #[Test]
    public function Validar_ClienteNaoPodeListarInscritos_ErroForbidden(): void
    {
        // Arrange
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($customer);

        // Act
        $response = $this->getJson('/api/newsletter');

        // Assert
        $response->assertStatus(403);
    }
}
