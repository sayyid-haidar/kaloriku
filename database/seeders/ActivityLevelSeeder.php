<?php

namespace Database\Seeders;

use App\Models\ActivityLevel;
use Illuminate\Database\Seeder;

class ActivityLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $activityLevels = [
            [
                'name' => 'Sedentary',
                'multiplier' => 1.2,
            ],
            [
                'name' => 'Lightly Active',
                'multiplier' => 1.375,
            ],
            [
                'name' => 'Moderately Active',
                'multiplier' => 1.55,
            ],
            [
                'name' => 'Very Active',
                'multiplier' => 1.725,
            ],
            [
                'name' => 'Extra Active',
                'multiplier' => 1.9,
            ],
        ];

        foreach ($activityLevels as $level) {
            ActivityLevel::create($level);
        }
    }
}
