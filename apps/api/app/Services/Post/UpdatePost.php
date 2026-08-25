<?php

namespace App\Services\Post;

use App\Models\Post;
use App\Services\Image\CreateImage;
use App\Services\Image\UpdateImage;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class UpdatePost
{
    public function __construct(
        protected UpdateImage $updateImageService,
        protected CreateImage $createImageService
    ) {
    }

    /**
     * Atualiza um post e seus dados associados de forma transacionalmente segura.
     *
     * @param Post $post
     * @param array $data
     * @return Post
     * @throws Exception
     */
    public function update(Post $post, array $data): Post
    {
        $newImageData = null;
        $oldImagePath = null;

        /** @var UploadedFile|null $newImageFile */
        if ($newImageFile = data_get($data, 'image')) {
            $newImageData = $this->createImageService->uploadOnly($newImageFile);
        }

        DB::beginTransaction();

        try {
            $post->update($data);

            if (array_key_exists('topics', $data)) {
                $post->topics()->sync($data['topics']);
            }

            if ($newImageData) {
                if ($post->image) {
                    $oldImagePath = $this->updateImageService->updateDbRecord($post->image, $newImageData);
                } else {
                    $this->createImageService->createDbRecord($post, $newImageData);
                }
            }

            DB::commit();

        } catch (Exception $e) {
            DB::rollBack();

            if ($newImageData) {
                $this->updateImageService->deleteFile($newImageData['path']);
            }

            throw $e;
        }

        if ($oldImagePath) {
            $this->updateImageService->deleteFile($oldImagePath);
        }

        Cache::forget("post_model.{$post->id}");

        return $post->load(['user.image', 'category', 'topics', 'image']);
    }
}
