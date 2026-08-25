<?php

namespace Tests\Feature\Company;

use App\Enum\RolesEnum;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

trait CompanyTestSetup
{
    protected User $adminUser;

    protected User $regularUser;

    public function setUp(): void
    {
        parent::setUp();

        $this->adminUser = User::factory()->create(['role' => RolesEnum::ADMIN]);

        $this->regularUser = User::factory()->create();
    }

    protected function actingAsAdmin(): self
    {
        Sanctum::actingAs($this->adminUser);

        return $this;
    }

    protected function actingAsRegularUser(): self
    {
        Sanctum::actingAs($this->regularUser);

        return $this;
    }
}
