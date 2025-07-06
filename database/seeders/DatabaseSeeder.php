<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ActivityLevelSeeder::class,
        ]);

        // Only create test users if we're not in production
        if (app()->environment(['local', 'testing'])) {
            // User::factory(10)->create();

            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        } else {
            // In production, create essential data without factories
            if (!User::where('email', 'admin@kaloriku.com')->exists()) {
                User::create([
                    'name' => 'Admin',
                    'email' => 'admin@kaloriku.com',
                    'password' => bcrypt('admin123'), // You should change this password
                    'email_verified_at' => now(),
                ]);
            }
        }
    }
}
