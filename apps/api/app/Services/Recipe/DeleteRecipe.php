<?php

namespace App\Services\Recipe;

use App\Models\Recipe;
use App\Services\Image\DeleteImage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class DeleteRecipe
{
    public function __construct(
        protected DeleteImage $deleteImageService,
    ) {
    }

    /**
     * Deleta uma receita, seus dados associados e o arquivo de imagem.
     *
     * @param Recipe $recipe
     * @return void
     * @throws Throwable
     */
    public function delete(Recipe $recipe): void
    {
        $imageToDelete = $recipe->image;
        $recipeId = $recipe->id;

        DB::transaction(function () use ($recipe, $imageToDelete) {
            $recipe->steps()->delete();
            $recipe->ingredients()->delete();
            $recipe->diets()->detach();

            if ($imageToDelete) {
                $this->deleteImageService->deleteDbRecord($imageToDelete);
            }

            $recipe->delete();
        });

        try {
            if ($imageToDelete) {
                $this->deleteImageService->deleteFile($imageToDelete->path);
            }

            Cache::forget("recipe_model.{$recipeId}");

        } catch (Throwable $e) {
            Log::warning('Recipe Cleanup Failed: Could not delete file or clear cache.', [
                'recipe_id' => $recipeId,
                'image_path' => $imageToDelete?->path,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
