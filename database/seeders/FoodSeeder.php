<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FoodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $foods = [
            // Indonesian Foods
            [
                'name' => 'Nasi Putih',
                'default_calorie' => 150,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Nasi Goreng',
                'default_calorie' => 250,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Ayam Bakar',
                'default_calorie' => 200,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Ayam Goreng',
                'default_calorie' => 280,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Sayur Lodeh',
                'default_calorie' => 100,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Sayur Sop',
                'default_calorie' => 100,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Gado-Gado',
                'default_calorie' => 200,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Soto Ayam',
                'default_calorie' => 180,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Rendang',
                'default_calorie' => 220,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Tempe Goreng',
                'default_calorie' => 100,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Tahu Goreng',
                'default_calorie' => 120,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Mie Ayam',
                'default_calorie' => 150,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Bakso',
                'default_calorie' => 200,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Es Teh Manis',
                'default_calorie' => 400,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Air Putih',
                'default_calorie' => 0,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Buah Apel',
                'default_calorie' => 50,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Pisang',
                'default_calorie' => 90,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Jeruk',
                'default_calorie' => 40,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Nasi Gudeg',
                'default_calorie' => 250,
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Ikan Bakar',
                'default_calorie' => 180,
                'created_by_user_id' => null,
            ],
        ];

        foreach ($foods as $food) {
            \App\Models\Food::create($food);
        }
    }
}
