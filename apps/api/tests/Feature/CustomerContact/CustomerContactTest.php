<?php

namespace Tests\Feature\CustomerContact;

use App\Enum\CustomerContactStatusEnum;
use App\Enum\RolesEnum;
use App\Models\CustomerContact;
use App\Models\User;
use App\Notifications\CustomerContactNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class CustomerContactTest extends TestCase
{
    use RefreshDatabase;

    // --- Testes para a rota pública (store) ---

    #[Test]
    public function Validar_QualquerUsuarioPodeEnviarFormularioDeContato_Sucesso(): void
    {
        // Arrange
        Notification::fake();
        $contactData = [
            'name' => 'Visitante Interessado',
            'email' => 'visitante@email.com',
            'phone' => '11987654321',
            'message' => 'Gostaria de mais informações sobre suas receitas.',
        ];

        // Act
        $response = $this->postJson('/api/contact', $contactData);

        // Assert
        $response->assertStatus(201);
        $this->assertDatabaseHas('customer_contacts', ['email' => 'visitante@email.com']);
        Notification::assertSentOnDemand(CustomerContactNotification::class);
    }

    #[Test]
    public function Validar_EnviarFormularioComDadosInvalidosFalha_ErroDeValidacao(): void
    {
        // Arrange
        $invalidData = ['email' => 'email-invalido', 'message' => ''];

        // Act
        $response = $this->postJson('/api/contact', $invalidData);

        // Assert
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'email', 'phone', 'message']);
    }

    // --- Testes para rotas protegidas (index, show, updateStatus) ---

    #[Test]
    public function Validar_AdminPodeListarContatos_Sucesso(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        CustomerContact::factory()->count(5)->create();
        Sanctum::actingAs($admin);

        // Act
        $response = $this->getJson('/api/contact');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonCount(5, 'data');
    }

    #[Test]
    public function Validar_ClienteNaoPodeListarContatos_ErroForbidden(): void
    {
        // Arrange
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($customer);

        // Act
        $response = $this->getJson('/api/contact');

        // Assert
        $response->assertStatus(403);
    }

    #[Test]
    public function Validar_AdminPodeVerUmContatoEspecifico_Sucesso(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $contact = CustomerContact::factory()->create();
        Sanctum::actingAs($admin);

        // Act
        $response = $this->getJson("/api/contact/{$contact->id}");

        // Assert
        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $contact->id);
    }

    #[Test]
    public function Validar_AdminPodeAtualizarStatusDeUmContato_Sucesso(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $contact = CustomerContact::factory()->create(['status' => CustomerContactStatusEnum::RECEIVED->value]);
        Sanctum::actingAs($admin);

        $newStatus = CustomerContactStatusEnum::IN_PROGRESS->value;

        // Act
        $response = $this->patchJson("/api/contact/{$contact->id}", ['status' => $newStatus]);

        // Assert
        $response->assertStatus(200);
        $this->assertDatabaseHas('customer_contacts', [
            'id' => $contact->id,
            'status' => $newStatus,
        ]);
        $response->assertJsonPath('data.status', $newStatus);
    }

    #[Test]
    public function Validar_AtualizarStatusComValorInvalidoFalha_ErroDeValidacao(): void
    {
        // Arrange
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $contact = CustomerContact::factory()->create();
        Sanctum::actingAs($admin);

        // Act
        $response = $this->patchJson("/api/contact/{$contact->id}", ['status' => 99]);

        // Assert
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['status']);
    }
}
