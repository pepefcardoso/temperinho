<?php

namespace App\Services\Image;

use App\Models\Image;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UpdateImage
{
    /**
     * Atualiza o registro da imagem no banco de dados com os novos dados.
     *
     * @param Image $image O modelo da imagem a ser atualizada.
     * @param array $newImageData O array com os dados do novo arquivo (path, name).
     * @return string Retorna o path do arquivo antigo para que possa ser deletado posteriormente.
     */
    public function updateDbRecord(Image $image, array $newImageData): string
    {
        $oldPath = $image->path;

        $image->update([
            'path' => $newImageData['path'],
            'name' => $newImageData['name'],
        ]);

        return $oldPath;
    }

    /**
     * Deleta um arquivo do disco de armazenamento (S3).
     *
     * @param string|null $path O path do arquivo a ser deletado.
     */
    public function deleteFile(?string $path): void
    {
        if (!$path) {
            return;
        }

        try {
            $disk = Storage::disk(config('filesystems.default'));
            if ($disk->exists($path)) {
                $disk->delete($path);
            }
        } catch (Exception $e) {
            Log::warning("Falha ao deletar o arquivo de imagem antigo (Path: {$path}): " . $e->getMessage());
        }
    }
}
