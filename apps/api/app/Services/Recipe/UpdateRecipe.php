<?php

namespace App\Services\Recipe;

use App\Models\Recipe;
use App\Services\Image\CreateImage;
use App\Services\Image\UpdateImage;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class UpdateRecipe
{
    public function __construct(
        protected CreateImage $createImageService,
        protected UpdateImage $updateImageService
    ) {
    }

    public function update(Recipe $recipe, array $data): Recipe
    {
        $newImageData = null;
        $oldImagePath = null;

        /** @var UploadedFile|null $newImageFile */
        if ($newImageFile = data_get($data, 'image')) {
            $newImageData = $this->createImageService->uploadOnly($newImageFile);
        }

        DB::beginTransaction();

        try {
            $this->updateRecipeDetails($recipe, $data);
            $this->syncDiets($recipe, $data);
            $this->handleIngredients($recipe, $data);
            $this->handleSteps($recipe, $data);

            if ($newImageData) {
                if ($recipe->image) {
                    $oldImagePath = $this->updateImageService->updateDbRecord($recipe->image, $newImageData);
                } else {
                    $this->createImageService->createDbRecord($recipe, $newImageData);
                }
            }

            DB::commit();

        } catch (Exception $e) {
            DB::rollback();

            if ($newImageData) {
                $this->updateImageService->deleteFile($newImageData['path']);
            }

            throw $e;
        }

        if ($oldImagePath) {
            $this->updateImageService->deleteFile($oldImagePath);
        }

        Cache::forget("recipe_model.{$recipe->id}");

        return $recipe->fresh([
            'diets',
            'category',
            'steps',
            'ingredients.unit',
            'image',
            'user.image'
        ]);
    }

    /**
     * Atualiza os detalhes básicos da receita.
     */
    protected function updateRecipeDetails(Recipe $recipe, array $data): void
    {
        $recipeData = Arr::only($data, ['title', 'description', 'time', 'portion', 'difficulty', 'category_id']);
        if (!empty($recipeData)) {
            $recipe->update($recipeData);
        }
    }

    /**
     * Sincroniza as dietas (adiciona/remove conforme necessário).
     */
    protected function syncDiets(Recipe $recipe, array $data): void
    {
        if (Arr::has($data, 'diets')) {
            $diets = $data['diets'] ?? [];
            throw_if(empty($diets), new Exception('As dietas são obrigatórias.'));
            $recipe->diets()->sync($diets);
        }
    }

    /**
     * Gerencia os ingredientes (atualiza, cria ou remove).
     */
    protected function handleIngredients(Recipe $recipe, array $data): void
    {
        if (!Arr::has($data, 'ingredients')) {
            return;
        }

        $incomingIngredients = collect($data['ingredients'] ?? []);
        throw_if($incomingIngredients->isEmpty(), new Exception('Os ingredientes são obrigatórios.'));

        $upsertData = $incomingIngredients->map(fn($item) => [
            'id' => $item['id'] ?? null,
            'recipe_id' => $recipe->id,
            'name' => $item['name'],
            'quantity' => $item['quantity'],
            'unit_id' => $item['unit_id'],
        ])->toArray();

        $recipe->ingredients()->upsert($upsertData, ['id'], ['name', 'quantity', 'unit_id']);
        $recipe->ingredients()->whereNotIn('id', $incomingIngredients->pluck('id')->filter())->delete();
    }

    /**
     * Gerencia os passos (atualiza, cria ou remove).
     */
    protected function handleSteps(Recipe $recipe, array $data): void
    {
        if (!Arr::has($data, 'steps')) {
            return;
        }

        $incomingSteps = collect($data['steps'] ?? []);
        throw_if($incomingSteps->isEmpty(), new Exception('Os passos são obrigatórios.'));

        $upsertData = $incomingSteps->map(fn($item, $index) => [
            'id' => $item['id'] ?? null,
            'recipe_id' => $recipe->id,
            'order' => $index + 1,
            'description' => $item['description'],
        ])->toArray();

        $recipe->steps()->upsert($upsertData, ['id'], ['order', 'description']);
        $recipe->steps()->whereNotIn('id', $incomingSteps->pluck('id')->filter())->delete();
    }
}
