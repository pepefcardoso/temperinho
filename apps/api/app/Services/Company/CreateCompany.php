<?php

namespace App\Services\Company;

use App\Models\Company;
use App\Models\User;
use App\Services\Image\CreateImage;
use App\Services\Image\DeleteImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class CreateCompany
{
    public function __construct(
        protected CreateImage $createImageService,
        protected DeleteImage $deleteImageService
    ) {
    }

    public function create(User $user, array $data): Company
    {
        $imageData = null;

        try {
            if ($imageFile = data_get($data, 'image')) {
                $imageData = $this->createImageService->uploadOnly($imageFile);
            }

            $company = DB::transaction(function () use ($user, $data, $imageData) {
                $companyData = $data;
                $companyData['user_id'] = $user->id;
                $company = Company::create($companyData);

                if ($imageData) {
                    $this->createImageService->createDbRecord($user, $company, $imageData);
                }

                return $company;
            });

            return $company;
        } catch (Throwable $e) {
            if ($imageData) {
                Log::info('Rolling back file upload due to DB transaction failure.', [
                    'path' => $imageData['path'],
                    'error' => $e->getMessage(),
                ]);
                $this->deleteImageService->deleteFile($imageData['path']);
            }
            throw $e;
        }
    }
}
