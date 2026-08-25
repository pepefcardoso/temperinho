<?php

namespace Tests\Feature\Image;

use App\Enum\RolesEnum;
use App\Models\Image;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ImageControllerTest extends TestCase
{
    use RefreshDatabase;

    private string $diskName;

    protected function setUp(): void
    {
        parent::setUp();
        $this->diskName = config('filesystems.default') ?: 'local';
    }

    #[Test]
    public function Validar_ListarImagensComoAdmin_Sucesso(): void
    {
        // --- ARRANGE ---
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        Sanctum::actingAs($admin);

        $user = User::factory()->create();
        Image::factory()->count(3)->create([
            'user_id' => $user->id,
            'imageable_id' => $user->id,
            'imageable_type' => User::class,
        ]);

        // --- ACT ---
        $response = $this->getJson('/api/images');

        // --- ASSERT ---
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data',
            'links',
            'meta',
        ]);
        $this->assertCount(3, $response->json('data'));
    }

    #[Test]
    public function Validar_ListarImagensComoCliente_ErroForbidden(): void
    {
        // --- ARRANGE ---
        $customer = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($customer);

        // --- ACT ---
        $response = $this->getJson('/api/images');

        // --- ASSERT ---
        $response->assertStatus(403);
    }

    #[Test]
    public function Validar_ExibirImagemComoDono_Sucesso(): void
    {
        // --- ARRANGE ---
        $user = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($user);

        $image = Image::factory()->create([
            'user_id' => $user->id,
            'imageable_id' => $user->id,
            'imageable_type' => User::class,
        ]);

        // --- ACT ---
        $response = $this->getJson("/api/images/{$image->id}");

        // --- ASSERT ---
        $response->assertStatus(200)
            ->assertJsonPath('id', $image->id)
            ->assertJsonPath('name', $image->name);
    }

    #[Test]
    public function Validar_ExibirImagemComoAdmin_Sucesso(): void
    {
        // --- ARRANGE ---
        $admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        Sanctum::actingAs($admin);

        $user = User::factory()->create();
        $image = Image::factory()->create([
            'user_id' => $user->id,
            'imageable_id' => $user->id,
            'imageable_type' => User::class,
        ]);

        // --- ACT ---
        $response = $this->getJson("/api/images/{$image->id}");

        // --- ASSERT ---
        $response->assertStatus(200)
            ->assertJsonPath('id', $image->id);
    }

    #[Test]
    public function Validar_ExibirImagemComoOutroUsuario_ErroForbidden(): void
    {
        // --- ARRANGE ---
        $otherUser = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($otherUser);

        $owner = User::factory()->create();
        $image = Image::factory()->create([
            'user_id' => $owner->id,
            'imageable_id' => $owner->id,
            'imageable_type' => User::class,
        ]);

        // --- ACT ---
        $response = $this->getJson("/api/images/{$image->id}");

        // --- ASSERT ---
        $response->assertStatus(403);
    }

    #[Test]
    public function Validar_UploadDeImagemValida_Sucesso(): void
    {
        // --- ARRANGE ---
        Storage::fake($this->diskName);
        $user = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($user);

        $file = UploadedFile::fake()->image('avatar.jpg');

        $data = [
            'file' => $file,
            'imageable_id' => $user->id,
            'imageable_type' => User::class,
        ];

        // --- ACT ---
        $response = $this->postJson('/api/images', $data);

        // --- ASSERT ---
        $response->assertStatus(201);
        $response->assertJsonStructure([
            'id',
            'name',
            'path',
            'url',
        ]);

        $image = Image::first();
        $this->assertNotNull($image);
        $this->assertEquals($user->id, $image->user_id);
        Storage::disk($this->diskName)->assertExists($image->path);
    }

    #[Test]
    public function Validar_UploadDeImagemParaOutroUsuario_ErroForbidden(): void
    {
        // --- ARRANGE ---
        Storage::fake($this->diskName);
        $user = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $otherUser = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($user);

        $file = UploadedFile::fake()->image('avatar.jpg');

        $data = [
            'file' => $file,
            'imageable_id' => $otherUser->id,
            'imageable_type' => User::class,
        ];

        // --- ACT ---
        $response = $this->postJson('/api/images', $data);

        // --- ASSERT ---
        $response->assertStatus(403);
    }

    #[Test]
    public function Validar_UploadDeImagemNaoAutenticado_ErroUnauthorized(): void
    {
        // --- ARRANGE ---
        Storage::fake($this->diskName);
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('avatar.jpg');

        $data = [
            'file' => $file,
            'imageable_id' => $user->id,
            'imageable_type' => User::class,
        ];

        // --- ACT ---
        $response = $this->postJson('/api/images', $data);

        // --- ASSERT ---
        $response->assertStatus(401);
    }

    #[Test]
    public function Validar_UploadDeImagemDadosInvalidos_ErroDeValidacao(): void
    {
        // --- ARRANGE ---
        $user = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($user);

        $data = [
            'imageable_id' => $user->id,
            'imageable_type' => User::class,
            // file is missing
        ];

        // --- ACT ---
        $response = $this->postJson('/api/images', $data);

        // --- ASSERT ---
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    #[Test]
    public function Validar_AtualizarImagemComoDono_Sucesso(): void
    {
        // --- ARRANGE ---
        Storage::fake($this->diskName);
        $user = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($user);

        // Upload original image file to fake storage
        $originalFile = UploadedFile::fake()->image('original.jpg');
        $originalPath = Storage::disk($this->diskName)->putFile(Image::$S3Directory, $originalFile);

        $image = Image::factory()->create([
            'user_id' => $user->id,
            'imageable_id' => $user->id,
            'imageable_type' => User::class,
            'path' => $originalPath,
            'name' => basename($originalPath),
        ]);

        $newFile = UploadedFile::fake()->image('updated.png');

        // --- ACT ---
        $response = $this->putJson("/api/images/{$image->id}", [
            'file' => $newFile,
        ]);

        // --- ASSERT ---
        $response->assertStatus(200);

        $image->refresh();
        Storage::disk($this->diskName)->assertExists($image->path);
        Storage::disk($this->diskName)->assertMissing($originalPath);
    }

    #[Test]
    public function Validar_AtualizarImagemComoOutroUsuario_ErroForbidden(): void
    {
        // --- ARRANGE ---
        Storage::fake($this->diskName);
        $otherUser = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($otherUser);

        $owner = User::factory()->create();
        $image = Image::factory()->create([
            'user_id' => $owner->id,
            'imageable_id' => $owner->id,
            'imageable_type' => User::class,
        ]);

        $newFile = UploadedFile::fake()->image('updated.png');

        // --- ACT ---
        $response = $this->putJson("/api/images/{$image->id}", [
            'file' => $newFile,
        ]);

        // --- ASSERT ---
        $response->assertStatus(403);
    }

    #[Test]
    public function Validar_DeletarImagemComoDono_Sucesso(): void
    {
        // --- ARRANGE ---
        Storage::fake($this->diskName);
        $user = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($user);

        $file = UploadedFile::fake()->image('avatar.jpg');
        $path = Storage::disk($this->diskName)->putFile(Image::$S3Directory, $file);

        $image = Image::factory()->create([
            'user_id' => $user->id,
            'imageable_id' => $user->id,
            'imageable_type' => User::class,
            'path' => $path,
            'name' => basename($path),
        ]);

        Storage::disk($this->diskName)->assertExists($path);

        // --- ACT ---
        $response = $this->deleteJson("/api/images/{$image->id}");

        // --- ASSERT ---
        $response->assertStatus(204);
        $this->assertDatabaseMissing('images', ['id' => $image->id]);
        Storage::disk($this->diskName)->assertMissing($path);
    }

    #[Test]
    public function Validar_DeletarImagemComoOutroUsuario_ErroForbidden(): void
    {
        // --- ARRANGE ---
        $otherUser = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        Sanctum::actingAs($otherUser);

        $owner = User::factory()->create();
        $image = Image::factory()->create([
            'user_id' => $owner->id,
            'imageable_id' => $owner->id,
            'imageable_type' => User::class,
        ]);

        // --- ACT ---
        $response = $this->deleteJson("/api/images/{$image->id}");

        // --- ASSERT ---
        $response->assertStatus(403);
        $this->assertDatabaseHas('images', ['id' => $image->id]);
    }
}
