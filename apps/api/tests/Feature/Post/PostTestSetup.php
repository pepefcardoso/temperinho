<?php

namespace Tests\Feature\Post;

use App\Enum\RolesEnum;
use App\Models\PostCategory;
use App\Models\PostTopic;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

/**
 * Trait para configurar o ambiente de teste para os Posts.
 */
trait PostTestSetup
{
    protected User $user;
    protected User $admin;
    protected PostCategory $category;
    protected PostTopic $topic;

    /**
     * Configuração executada antes de cada teste.
     */
    public function setUp(): void
    {
        parent::setUp();
        Storage::fake('s3');

        $this->user = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $this->admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $this->category = PostCategory::factory()->create();
        $this->topic = PostTopic::factory()->create();
    }
}
