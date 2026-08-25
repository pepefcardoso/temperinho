<?php

namespace Database\Seeders;

use App\Models\User;
use App\Enum\RolesEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            [
                'email' => env('ADMIN_EMAIL') ?: 'admin@example.com',
            ],
            [
                'name' => env('ADMIN_NAME') ?: 'Admin User',
                'birthday' => env('ADMIN_BIRTHDAY') ?: '1990-01-01',
                'phone' => env('ADMIN_PHONE') ?: '99999999999',
                'password' => Hash::make(env('ADMIN_PASSWORD') ?: 'password'),
                'role' => env('ADMIN_ROLE') ?: RolesEnum::ADMIN->value,
                'email_verified_at' => now(),
            ]
        );
    }
}
