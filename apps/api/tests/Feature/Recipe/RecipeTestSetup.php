<?php

namespace Tests\Feature\Recipe;

use App\Enum\RecipeDifficultyEnum;
use App\Enum\RolesEnum;
use App\Models\Recipe;
use App\Models\RecipeCategory;
use App\Models\RecipeDiet;
use App\Models\RecipeUnit;
use App\Models\User;
use Illuminate\Http\UploadedFile;

trait RecipeTestSetup
{
    protected User $user;
    protected User $admin;
    protected RecipeCategory $category;
    protected $diets;
    protected $units;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->admin = User::factory()->create(['role' => RolesEnum::ADMIN]);

        $this->category = RecipeCategory::factory()->create();
        $this->diets = RecipeDiet::factory(3)->create();
        $this->units = RecipeUnit::factory(5)->create();
    }

    protected function getValidRecipeData(): array
    {
        return [
            'title' => 'Receita de Teste Incrível',
            'description' => 'Uma descrição detalhada da receita de teste.',
            'time' => 60,
            'portion' => 4,
            'difficulty' => RecipeDifficultyEnum::NORMAL->value,
            'category_id' => $this->category->id,
            'diets' => $this->diets->pluck('id')->toArray(),
            'steps' => [
                ['description' => 'Primeiro passo da receita.'],
                ['description' => 'Segundo passo da receita.'],
            ],
            'ingredients' => [
                ['name' => 'Ingrediente 1', 'quantity' => 100, 'unit_id' => $this->units->first()->id],
                ['name' => 'Ingrediente 2', 'quantity' => 2.5, 'unit_id' => $this->units->last()->id],
            ],
            'image' => UploadedFile::fake()->image('recipe.jpg'),
        ];
    }

    protected function getRecipeDataForUpdate(Recipe $recipe): array
    {
        $recipe->load(['diets', 'ingredients', 'steps']);
        return [
            'title' => $recipe->title,
            'description' => $recipe->description,
            'time' => $recipe->time,
            'portion' => $recipe->portion,
            'difficulty' => $recipe->difficulty->value,
            'category_id' => $recipe->category_id,
            'diets' => $recipe->diets->pluck('id')->toArray(),
            'steps' => $recipe->steps->map(fn($step) => ['id' => $step->id, 'description' => $step->description])->toArray(),
            'ingredients' => $recipe->ingredients->map(fn($ing) => [
                'id' => $ing->id,
                'name' => $ing->name,
                'quantity' => $ing->quantity,
                'unit_id' => $ing->unit_id,
            ])->toArray(),
        ];
    }
}
