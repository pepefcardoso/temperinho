<?php

namespace App\Services\Post;

use App\Models\Post;
use App\Services\Image\DeleteImage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class DeletePost
{
    public function __construct(private DeleteImage $deleteImageService)
    {
    }

    /**
     * Deleta um post, seus relacionamentos e o arquivo de imagem associado.
     *
     * @param Post $post
     * @return void
     * @throws Throwable
     */
    public function delete(Post $post): void
    {
        $imageToDelete = $post->image;
        $postId = $post->id;

        DB::transaction(function () use ($post, $imageToDelete) {
            $post->topics()->detach();

            if ($imageToDelete) {
                $this->deleteImageService->deleteDbRecord($imageToDelete);
            }

            $post->delete();
        });

        try {
            if ($imageToDelete) {
                $this->deleteImageService->deleteFile($imageToDelete->path);
            }

            Cache::forget("post_model.{$postId}");

        } catch (Throwable $e) {
            Log::warning('Post Cleanup Failed: Could not delete file or clear cache after deleting post record.', [
                'post_id' => $postId,
                'image_path' => $imageToDelete?->path,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
