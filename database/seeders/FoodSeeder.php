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
                'calories_per_100g' => 130,
                'description' => 'Nasi putih biasa',
                'is_verified' => true,
                'tags' => ['nasi', 'karbohidrat', 'pokok'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Nasi Goreng',
                'calories_per_100g' => 163,
                'description' => 'Nasi goreng dengan telur dan sayuran',
                'is_verified' => true,
                'tags' => ['nasi', 'gorengan', 'lengkap'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Ayam Bakar',
                'calories_per_100g' => 189,
                'description' => 'Ayam bakar tanpa kulit',
                'is_verified' => true,
                'tags' => ['ayam', 'protein', 'bakar'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Ayam Goreng',
                'calories_per_100g' => 250,
                'description' => 'Ayam goreng dengan kulit',
                'is_verified' => true,
                'tags' => ['ayam', 'protein', 'gorengan'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Sayur Lodeh',
                'calories_per_100g' => 65,
                'description' => 'Sayur lodeh dengan santan',
                'is_verified' => true,
                'tags' => ['sayur', 'santan', 'tradisional'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Sayur Sop',
                'calories_per_100g' => 40,
                'description' => 'Sup sayuran segar',
                'is_verified' => true,
                'tags' => ['sayur', 'segar', 'kuah'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Gado-Gado',
                'calories_per_100g' => 150,
                'description' => 'Salad sayuran dengan bumbu kacang',
                'is_verified' => true,
                'tags' => ['sayur', 'kacang', 'salad'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Soto Ayam',
                'calories_per_100g' => 120,
                'description' => 'Soto ayam dengan kuah bening',
                'is_verified' => true,
                'tags' => ['soto', 'ayam', 'kuah'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Rendang',
                'calories_per_100g' => 220,
                'description' => 'Rendang daging sapi',
                'is_verified' => true,
                'tags' => ['daging', 'pedas', 'tradisional'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Tempe Goreng',
                'calories_per_100g' => 193,
                'description' => 'Tempe goreng crispy',
                'is_verified' => true,
                'tags' => ['tempe', 'protein', 'gorengan'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Tahu Goreng',
                'calories_per_100g' => 271,
                'description' => 'Tahu goreng renyah',
                'is_verified' => true,
                'tags' => ['tahu', 'protein', 'gorengan'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Mie Ayam',
                'calories_per_100g' => 110,
                'description' => 'Mie ayam dengan topping lengkap',
                'is_verified' => true,
                'tags' => ['mie', 'ayam', 'kuah'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Bakso',
                'calories_per_100g' => 85,
                'description' => 'Bakso sapi dengan kuah',
                'is_verified' => true,
                'tags' => ['bakso', 'daging', 'kuah'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Es Teh Manis',
                'calories_per_100g' => 35,
                'description' => 'Es teh manis segar',
                'is_verified' => true,
                'tags' => ['minuman', 'manis', 'es'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Air Putih',
                'calories_per_100g' => 0,
                'description' => 'Air putih tawar',
                'is_verified' => true,
                'tags' => ['minuman', 'sehat'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Buah Apel',
                'calories_per_100g' => 52,
                'description' => 'Apel segar tanpa kulit',
                'is_verified' => true,
                'tags' => ['buah', 'segar', 'vitamin'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Pisang',
                'calories_per_100g' => 89,
                'description' => 'Pisang matang segar',
                'is_verified' => true,
                'tags' => ['buah', 'manis', 'kalium'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Jeruk',
                'calories_per_100g' => 47,
                'description' => 'Jeruk segar vitamin C',
                'is_verified' => true,
                'tags' => ['buah', 'asam', 'vitamin-c'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Nasi Gudeg',
                'calories_per_100g' => 165,
                'description' => 'Nasi gudeg Yogyakarta',
                'is_verified' => true,
                'tags' => ['nasi', 'gudeg', 'tradisional'],
                'created_by_user_id' => null,
            ],
            [
                'name' => 'Ikan Bakar',
                'calories_per_100g' => 180,
                'description' => 'Ikan bakar tanpa minyak',
                'is_verified' => true,
                'tags' => ['ikan', 'protein', 'bakar'],
                'created_by_user_id' => null,
            ],
        ];

        foreach ($foods as $food) {
            \App\Models\Food::create($food);
        }
    }
}
