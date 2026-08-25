<?php

namespace App\Services\Company;

use App\Models\Company;
use App\Services\Image\DeleteImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class DeleteCompany
{
    public function __construct(private DeleteImage $deleteImageService)
    {
    }

    public function delete(Company $company): void
    {
        $imageToDelete = $company->image;
        $companyId = $company->id;

        DB::transaction(function () use ($company, $imageToDelete) {
            if ($imageToDelete) {
                $this->deleteImageService->deleteDbRecord($imageToDelete);
            }
            $company->delete();
        });

        try {
            if ($imageToDelete) {
                $this->deleteImageService->deleteFile($imageToDelete->path);
            }

        } catch (Throwable $e) {
            Log::warning('Company Cleanup Failed: Could not delete file after deleting company record.', [
                'company_id' => $companyId,
                'image_path' => $imageToDelete?->path,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
