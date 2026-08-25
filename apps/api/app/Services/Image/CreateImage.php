<?php

namespace App\Services\Image;

use App\Models\Image;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CreateImage
{
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];

    /**
     * Valida e armazena um arquivo de imagem, sem criar o registro no banco.
     *
     * @param UploadedFile $file O arquivo de imagem enviado.
     * @return array Retorna um array com o path e o nome do arquivo ['path' => ..., 'name' => ...].
     * @throws Exception Se o arquivo for inválido ou a extensão não for suportada.
     */
    public function uploadOnly(UploadedFile $file): array
    {
        if (!$file->isValid()) {
            throw new Exception('Arquivo inválido.');
        }

        $this->validateFileExtension($file);

        $disk = Storage::disk(config('filesystems.default'));

        $path = $disk->putFile(Image::$S3Directory, $file);

        if (!$path) {
            throw new Exception('Falha ao armazenar o arquivo.');
        }

        return [
            'path' => $path,
            'name' => basename($path)
        ];
    }

    /**
     * Cria o registro da imagem no banco de dados.
     *
     * @param Model $model O modelo ao qual a imagem pertence (ex: User, Post).
     * @param array $imageData O array retornado por uploadOnly().
     * @return Image
     */
    public function createDbRecord(User $user, Model $model, array $imageData): Image
    {
        return $model->image()->create([
            'path' => $imageData['path'],
            'name' => $imageData['name'],
            'user_id' => $user->id,
        ]);
    }

    /**
     * Valida se a extensão do arquivo está na lista de permitidas.
     *
     * @param UploadedFile $file
     * @throws Exception
     */
    private function validateFileExtension(UploadedFile $file): void
    {
        $extension = strtolower($file->getClientOriginalExtension());
        if (!in_array($extension, self::ALLOWED_EXTENSIONS)) {
            throw new Exception("Extensão de arquivo não suportada: {$extension}.");
        }
    }
}
