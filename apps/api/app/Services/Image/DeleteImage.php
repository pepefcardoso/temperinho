<?php

namespace App\Services\Image;

use App\Models\Image;
use Throwable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DeleteImage
{
    public function deleteDbRecord(Image $image): ?string
    {
        $filePath = $image->path;
        $image->delete();
        return $filePath ?: null;
    }

    public function deleteFile(?string $filePath): void
    {
        if (!$filePath) {
            return;
        }

        try {
            $diskName = config('filesystems.default') ?: 's3';
            $disk = Storage::disk($diskName);
            if ($disk->exists($filePath)) {
                $disk->delete($filePath);
            } else {
                Log::info("Imagem não encontrada no storage ({$diskName}): {$filePath}");
            }
        } catch (Throwable $e) {
            Log::warning("Falha ao deletar o arquivo de imagem (Path: {$filePath}): " . $e->getMessage());
        }
    }
}
