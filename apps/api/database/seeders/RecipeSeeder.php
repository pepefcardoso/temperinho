<?php

namespace Database\Seeders;

use App\Enum\RecipeDifficultyEnum;
use App\Models\Recipe;
use App\Models\RecipeCategory;
use App\Models\RecipeDiet;
use App\Models\RecipeUnit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class RecipeSeeder extends Seeder
{
    public function run(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = OFF;');
        } elseif ($driver === 'pgsql') {
            DB::statement("SET session_replication_role = 'replica';");
        }

        Recipe::truncate();

        if ($driver === 'sqlite') {
            DB::statement('PRAGMA foreign_keys = ON;');
        } elseif ($driver === 'pgsql') {
            DB::statement("SET session_replication_role = 'origin';");
        }

        $author = User::first();
        if (!$author) {
            $this->command->info('Nenhum usuário encontrado. Crie um usuário antes de executar o RecipeSeeder.');
            return;
        }

        $jsonPath = database_path('seeders/data/recipes.json');
        if (!File::exists($jsonPath)) {
            $this->command->error('Arquivo recipes.json não encontrado!');
            return;
        }

        $json = File::get($jsonPath);
        $recipesData = json_decode($json, true);

        Recipe::withoutSyncingToSearch(function () use ($recipesData, $author) {
            foreach ($recipesData as $recipeItem) {
                $category = RecipeCategory::where('name', $recipeItem['category_name'])->firstOrFail();
                $dietIds = RecipeDiet::whereIn('name', $recipeItem['diet_names'])->pluck('id');

                $recipeDetails = $recipeItem['details'];
                $recipeDetails['category_id'] = $category->id;
                $recipeDetails['user_id'] = $author->id;

                $difficultyString = strtolower($recipeDetails['difficulty']);
                $recipeDetails['difficulty'] = match($difficultyString) {
                    'facil' => RecipeDifficultyEnum::FACIL,
                    'medio' => RecipeDifficultyEnum::NORMAL,
                    'dificil' => RecipeDifficultyEnum::DIFICIL,
                };

                $ingredientsToCreate = array_map(function ($ingredient) {
                    $unit = RecipeUnit::where('name', 'like', $ingredient['unit_name'])->firstOrFail();
                    return [
                        'name' => $ingredient['name'],
                        'quantity' => $ingredient['quantity'],
                        'unit_id' => $unit->id,
                    ];
                }, $recipeItem['ingredients']);

                $recipe = Recipe::create($recipeDetails);
                $recipe->diets()->sync($dietIds);
                $recipe->ingredients()->createMany($ingredientsToCreate);
                $recipe->steps()->createMany($recipeItem['steps']);
            }
        });
    }
}
