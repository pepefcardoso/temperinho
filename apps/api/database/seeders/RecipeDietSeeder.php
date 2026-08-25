<?php

namespace Database\Seeders;

use App\Models\RecipeDiet;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RecipeDietSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dietNames = [
            'Sem glúten',
            'Sem lactose',
            'Sem açúcar refinado',
            'Sem nozes/oleaginosas',
            'Sem soja',
            'Sem ovo',
            'Low-carb',
            'Ceto',
            'Paleo',
            'Low-fat',
            'Low-FODMAP',
            'Eliminação de histamina',
            'Vegetariana',
            'Vegana',
            'Pescetariana',
            'Kosher',
            'Halal',
            'Sem sal',
            'Diabéticos',
            'Sem corantes e conservantes artificiais',
        ];

        foreach ($dietNames as $name) {
            RecipeDiet::create([
                'name' => $name,
                'normalized_name' => Str::upper($name),
            ]);
        }
    }
}
