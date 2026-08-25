<?php

namespace Tests\Feature\NewsletterCustomer;

use App\Enum\RolesEnum;
use App\Models\NewsletterCustomer;
use App\Models\User;
use App\Notifications\DeleteNewsletterCustomerNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class NewsletterCustomerDestroyTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function Validar_AdminPodeRemoverInscritoDaNewsletter_Sucesso(): void
    {
        // Arrange
        Notification::fake();
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $newsletterCustomer = NewsletterCustomer::factory()->create();
        Sanctum::actingAs($admin);

        // Act
        $response = $this->deleteJson("/api/newsletter/{$newsletterCustomer->id}");

        // Assert
        $response->assertStatus(204);
        $this->assertDatabaseMissing('newsletter_customers', ['id' => $newsletterCustomer->id]);
        Notification::assertSentOnDemand(DeleteNewsletterCustomerNotification::class);
    }

    #[Test]
    public function Validar_ClienteNaoPodeRemoverInscritoDaNewsletter_ErroForbidden(): void
    {
        // Arrange
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $newsletterCustomer = NewsletterCustomer::factory()->create();
        Sanctum::actingAs($customer);

        // Act
        $response = $this->deleteJson("/api/newsletter/{$newsletterCustomer->id}");

        // Assert
        $response->assertStatus(403);
    }
}
