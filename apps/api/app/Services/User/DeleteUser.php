<?php

namespace App\Services\User;

use App\Models\Post;
use App\Models\User;
use App\Notifications\DeletedUser;
use App\Services\Image\DeleteImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Throwable;

class DeleteUser
{
    public function __construct(
        protected DeleteImage $deleteImageService
    ) {
    }

    /**
     * Anonimiza um usuário (LGPD): remove dados pessoais mas preserva o
     * conteúdo que ele publicou (receitas, artigos, comentários, avaliações).
     *
     * @param User $user
     * @return void
     * @throws Throwable
     */
    public function delete(User $user): void
    {
        $imageToDelete = $user->image;
        $originalEmail = $user->email;
        $originalName = $user->name;
        $userId = $user->id;

        DB::transaction(function () use ($user, $imageToDelete) {
            $user->tokens()->delete();

            $user->forceFill([
                'name' => 'Usuário Removido',
                'email' => "deleted-user-{$user->id}@temperinho.invalid",
                'phone' => null,
                'birthday' => null,
                'password' => Hash::make(Str::random(40)),
                'remember_token' => null,
                'provider' => null,
                'provider_id' => null,
                'deleted_at' => now(),
            ])->save();

            if ($imageToDelete) {
                $this->deleteImageService->deleteDbRecord($imageToDelete);
            }

            if ($company = $user->company) {
                $company->forceFill([
                    'email' => "empresa-removida-{$company->id}@temperinho.invalid",
                    'phone' => "removido-{$company->id}",
                    'cnpj' => null,
                    'address' => 'Não informado',
                ])->save();

                Post::where('company_id', $company->id)
                    ->where('status', Post::STATUS_PENDING)
                    ->update([
                        'status' => Post::STATUS_REJECTED,
                        'rejection_reason' => 'A conta do autor foi removida antes da revisão.',
                    ]);
            }
        });

        try {
            if ($imageToDelete) {
                $this->deleteImageService->deleteFile($imageToDelete->path);
            }

            $deletedUserInfo = (new User)->forceFill(['name' => $originalName, 'email' => $originalEmail]);
            Notification::route('mail', $originalEmail)
                ->notify(new DeletedUser($deletedUserInfo));

        } catch (Throwable $e) {
            Log::warning('User Cleanup Failed: Could not delete file or send notification.', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
