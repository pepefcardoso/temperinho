<?php

namespace Tests\Feature\NewsletterCustomer;

use App\Enum\RolesEnum;
use App\Models\NewsletterCustomer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class NewsletterCustomerShowTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_AdminPodeVerUmInscritoEspecifico_Sucesso(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $newsletterCustomer = NewsletterCustomer::factory()->create();
        Sanctum::actingAs($admin);

        // Act
        $response = $this->getJson("/api/newsletter/{$newsletterCustomer->id}");

        // Assert
        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $newsletterCustomer->id);
    }

    #[Test]
    public function Validar_ClienteNaoPodeVerUmInscritoEspecifico_ErroForbidden(): void
    {
        // Arrange
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $newsletterCustomer = NewsletterCustomer::factory()->create();
        Sanctum::actingAs($customer);

        // Act
        $response = $this->getJson("/api/newsletter/{$newsletterCustomer->id}");

        // Assert
        $response->assertStatus(403);
    }
}
