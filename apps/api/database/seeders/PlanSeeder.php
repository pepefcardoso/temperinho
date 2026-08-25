<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Primeiro Sabor',
                'badge' => 'Para Começar 🌱',
                'price' => 4900,
                'period' => 'monthly',
                'description' => 'A porta de entrada para pequenos produtores e negócios locais que querem ser vistos pela nossa comunidade.',
                'features' => [
                    '1 Artigo Patrocinado no Blog por mês',
                    'Divulgação do artigo nas nossas Redes Sociais',
                    'Inclusão da sua marca na seção de Apoiadores',
                ],
                'status' => 'active',
                'display_order' => 1,
                'max_users' => 1,
                'max_posts' => 1,
                'max_recipes' => null,
                'max_banners' => 0,
                'max_email_campaigns' => 0,
                'newsletter' => true,
                'trial_days' => 0,
                'is_popular' => false,
            ],
            [
                'name' => 'Marca em Destaque',
                'badge' => 'Mais Popular 🚀',
                'price' => 12900,
                'period' => 'monthly',
                'description' => 'Ideal para marcas que procuram um destaque consistente e um maior envolvimento com o nosso público.',
                'features' => [
                    '3 Artigos Patrocinados no Blog por mês',
                    'Divulgação dedicada nas Redes Sociais',
                    'Banner Fixo na barra lateral das receitas',
                    'Destaque na nossa Newsletter semanal',
                ],
                'status' => 'active',
                'display_order' => 2,
                'max_users' => 5,
                'max_posts' => 3,
                'max_recipes' => null,
                'max_banners' => 1,
                'max_email_campaigns' => 1,
                'newsletter' => true,
                'trial_days' => 7,
                'is_popular' => true,
            ],
            [
                'name' => 'Parceria Estratégica',
                'badge' => 'Sob Medida 🤝',
                'price' => 0,
                'period' => 'monthly',
                'description' => 'Uma solução completa e sob medida para marcas que desejam criar um impacto duradouro e integrado.',
                'features' => [
                    'Pacote customizável de Posts Patrocinados',
                    'Campanhas de email marketing dedicadas',
                    'Banners em todas as áreas estratégicas do site',
                    'Consultoria de estratégia de conteúdo',
                    'Gerente de conta dedicado',
                ],
                'status' => 'active',
                'display_order' => 3,
                'max_users' => null,
                'max_posts' => null,
                'max_recipes' => null,
                'max_banners' => null,
                'max_email_campaigns' => null,
                'newsletter' => true,
                'trial_days' => 0,
                'is_popular' => false,
            ],
        ];

        foreach ($plans as $planData) {
            Plan::updateOrCreate(
                ['name' => $planData['name']],
                $planData
            );
        }
    }
}
