<?php

namespace Database\Seeders;

use App\Models\PostCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoryNames = [
            'Receitas por Dieta',
            'Sem glúten',
            'Sem lactose',
            'Sem açúcar',
            'Keto',
            'Low-FODMAP',
            'Vegana e vegetariana',
            'Planejamento de Refeições',
            'Cardápios semanais',
            'Preparação antecipada (batch cooking)',
            'Lanches rápidos',
            'Nutrição e Saúde',
            'Equilíbrio de macronutrientes',
            'Micronutrientes essenciais',
            'Suplementação recomendada',
            'Dicas de Cozinha & Técnicas',
            'Substituições de ingredientes',
            'Técnicas básicas (amerelos, fermentação…)',
            'Equipamentos úteis',
            'Saúde Digestiva',
            'Ciência & Tendências',
            'Mitos e Verdades',
            'Guias de Compra',
            'Como ler rótulos',
            'Reviews & Comparativos',
            'Entrevistas & Histórias',
            'Vida Social & Dinâmicas',
            'Comer fora e viajar',
            'Economia Doméstica',
            'Desafios & Programas',
            'Receitas Rápidas & Express',
            'Infográficos & Vídeos',
        ];

        foreach ($categoryNames as $name) {
            PostCategory::create([
                'name' => $name,
                'normalized_name' => Str::upper($name),
            ]);
        }
    }
}
