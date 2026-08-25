<?php

namespace App\Services\Company;

use App\Models\Company;
use App\Services\Image\CreateImage;
use App\Services\Image\UpdateImage;
use App\Services\Image\DeleteImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Arr;
use Throwable;

class UpdateCompany
{
    public function __construct(
        protected UpdateImage $updateImageService,
        protected CreateImage $createImageService,
        protected DeleteImage $deleteImageService
    ) {
    }

    public function update(Company $company, array $data): Company
    {
        $newImageData = null;
        $oldImagePath = null;

        if ($newImageFile = data_get($data, 'image')) {
            $newImageData = $this->createImageService->uploadOnly($newImageFile);
        }

        try {
            $company = DB::transaction(function () use ($company, $data, $newImageData, &$oldImagePath) {
                $updateData = Arr::except($data, ['image']);
                $company->update($updateData);

                if ($newImageData) {
                    if ($company->image) {
                        $oldImagePath = $this->updateImageService->updateDbRecord($company->image, $newImageData);
                    } else {
                        $this->createImageService->createDbRecord($company, $newImageData);
                    }
                }

                return $company;
            });
        } catch (Throwable $e) {
            if ($newImageData) {
                $this->deleteImageService->deleteFile($newImageData['path']);
            }
            throw $e;
        }

        if ($oldImagePath) {
            $this->deleteImageService->deleteFile($oldImagePath);
        }

        return $company->refresh();
    }
}
