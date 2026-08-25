<?php

namespace App\Services\User;

use App\Models\User;
use App\Notifications\DeletedUser;
use App\Services\Image\DeleteImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Throwable;

class DeleteUser
{
    public function __construct(
        protected DeleteImage $deleteImageService
    ) {
    }

    /**
     * Deleta um usuário, sua imagem, e notifica o e-mail de forma segura.
     *
     * @param User $user
     * @return void
     * @throws Throwable
     */
    public function delete(User $user): void
    {
        $imageToDelete = $user->image;
        $userEmail = $user->email;
        $userName = $user->name;
        $userId = $user->id;

        DB::transaction(function () use ($user, $imageToDelete) {
            if ($imageToDelete) {
                $this->deleteImageService->deleteDbRecord($imageToDelete);
            }

            $user->delete();
        });

        try {
            if ($imageToDelete) {
                $this->deleteImageService->deleteFile($imageToDelete->path);
            }

            $deletedUserInfo = (new User)->forceFill(['name' => $userName, 'email' => $userEmail]);
            Notification::route('mail', $userEmail)
                ->notify(new DeletedUser($deletedUserInfo));

        } catch (Throwable $e) {
            Log::warning('User Cleanup Failed: Could not delete file or send notification.', [
                'user_id' => $userId,
                'user_email' => $userEmail,
                'image_path' => $imageToDelete?->path,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
