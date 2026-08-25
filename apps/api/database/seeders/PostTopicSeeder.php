<?php

namespace Database\Seeders;

use App\Models\PostTopic;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostTopicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $topicNames = [
            'SemGluten', 'SemLactose', 'SemAcucar', 'LowCarb', 'Cetogenica', 'Paleo',
            'LowFODMAP', 'Vegano', 'Vegetariano', 'SemSoja', 'SemOleaginosas', 'SemOvo',
            'SemSal', 'Diabetico', 'GlutenFreeBrasil', 'LactoseFree', 'AcucarZero',
            'ReceitasFuncionais', 'ReceitasFit', 'ReceitasSaudaveis', 'BatchCooking',
            'PlanejamentoAlimentar', 'NutricaoIntuitiva', 'DietaEliminacao',
            'MitosEDietas', 'CozinhaPratica', 'SubstituicoesSaudaveis', 'GuiaDeCompras',
            'SemConservantes', 'SemCorantes', 'SemGlutenSemLactose', 'SemGlutenSemAcucar',
            'ReducaoDeCarne', 'Crudivorismo', 'IntoleranciaAlimentar', 'AlimentacaoSaudavel',
            'ReeducacaoAlimentar', 'Superalimentos', 'Probioticos', 'Prebioticos', 'Detox',
            'Desintoxicacao', 'SmoothiesFit', 'SucosVerdes', 'SnackingSaudavel',
            'LanchesSemCulpa', 'SobremesasFit', 'BolosSemGluten', 'PaesSemGluten',
            'ChocolatesSemLactose', 'AlternativasVegetais', 'ReceitasSemFarinha',
            'FarinhasAlternativas', 'LeitesVegetais', 'ProteinasVegetais', 'Omega3',
            'AlimentacaoFuncional', 'ReceitasLowFat', 'PreparacaoAntecipada',
            'ComidaDeVerdade', 'HábitosSaudáveis', 'ComerForaSemCulpa',
        ];

        foreach ($topicNames as $name) {
            PostTopic::create([
                'name' => $name,
                'normalized_name' => Str::upper($name),
            ]);
        }
    }
}
