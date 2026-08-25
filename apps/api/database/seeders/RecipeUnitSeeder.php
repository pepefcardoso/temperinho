<?php

namespace Database\Seeders;

use App\Models\RecipeUnit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RecipeUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $unitNames = [
            'Mililitro', 'Litro', 'Colher de chá', 'Colher de sopa', 'Xícara de chá',
            'Copo americano', 'Taça', 'Miligrama', 'Grama', 'Quilograma', 'Onça', 'Libra',
            'Pitada', 'Talhada', 'Punhado', 'Unidade', 'Ramo', 'Folha',
        ];

        foreach ($unitNames as $name) {
            RecipeUnit::create([
                'name' => $name,
                'normalized_name' => Str::upper($name),
            ]);
        }
    }
}
