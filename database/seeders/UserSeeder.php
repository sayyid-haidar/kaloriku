<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test user if doesn't exist
        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Create admin user if doesn't exist
        User::firstOrCreate(
            ['email' => 'admin@kalori.com'],
            [
                'name' => 'Admin Kalori',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );
    }
}
