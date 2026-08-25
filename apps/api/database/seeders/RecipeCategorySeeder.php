<?php

namespace Database\Seeders;

use App\Models\RecipeCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RecipeCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoryNames = [
            'Aperitivos e petiscos',
            'Saladas',
            'Sopas e caldos',
            'Entradas e antepastos',
            'Pratos principais',
            'Acompanhamentos',
            'Massas',
            'Pães e fermentados',
            'Bolos e tortas',
            'Biscoitos, cookies & bisnagas',
            'Sobremesas e doces',
            'Confeitaria fina',
            'Molhos e temperos',
            'Conservas e picles',
            'Bebidas',
            'Dietéticas e funcionais',
        ];

        foreach ($categoryNames as $name) {
            RecipeCategory::create([
                'name' => $name,
                'normalized_name' => Str::upper($name),
            ]);
        }
    }
}
