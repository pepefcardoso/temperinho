<?php

namespace App\Services\User;

use App\Models\User;
use App\Services\Image\CreateImage;
use App\Services\Image\UpdateImage;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class UpdateUser
{
    public function __construct(
        protected CreateImage $createImageService,
        protected UpdateImage $updateImageService
    ) {
    }

    /**
     * Atualiza um usuário e sua imagem de perfil de forma transacionalmente segura.
     *
     * @param User $user
     * @param array $data
     * @return User
     * @throws Exception
     */
    public function update(User $user, array $data): User
    {
        $newImageData = null;
        $oldImagePath = null;

        /** @var UploadedFile|null $newImageFile */
        if ($newImageFile = data_get($data, 'image')) {
            $newImageData = $this->createImageService->uploadOnly($newImageFile);
        }

        DB::beginTransaction();

        try {
            $user->update($data);

            if ($newImageData) {
                if ($user->image) {
                    $oldImagePath = $this->updateImageService->updateDbRecord($user->image, $newImageData);
                } else {
                    $this->createImageService->createDbRecord($user, $newImageData);
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

        return $user->load('image');
    }
}
