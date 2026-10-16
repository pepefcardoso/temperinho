<?php

namespace Tests\Feature\Post;

use App\Enum\RolesEnum;
use App\Models\Company;
use App\Models\Plan;
use App\Models\PostCategory;
use App\Models\PostTopic;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

trait PostTestSetup
{
    protected User $user;
    protected User $admin;
    protected User $internal;
    protected PostCategory $category;
    protected PostTopic $topic;

    public function setUp(): void
    {
        parent::setUp();
        Storage::fake('s3');

        $this->user = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $this->admin = User::factory()->create(['role' => RolesEnum::ADMIN]);
        $this->internal = User::factory()->create(['role' => RolesEnum::INTERNAL]);
        $this->category = PostCategory::factory()->create();
        $this->topic = PostTopic::factory()->create();
    }

    protected function createSponsorWithActivePlan(): User
    {
        $user = User::factory()->create(['role' => RolesEnum::CUSTOMER]);
        $company = Company::factory()->create(['user_id' => $user->id]);
        $plan = Plan::factory()->create(['max_posts' => null]);

        Subscription::factory()->create([
            'company_id' => $company->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'ends_at' => now()->addMonth(),
        ]);

        return $user;
    }
}
