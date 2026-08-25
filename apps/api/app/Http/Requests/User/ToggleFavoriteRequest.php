<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;

/**
 * @property string $post_id
 * @property string $recipe_id
 * @mixin \Illuminate\Http\Request
 * @method void merge(array $input)
 */
class ToggleFavoriteRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = Auth::user();
        if (!$user) {
            return false;
        }

        $targetUser = Route::current()->parameter('user') ?? $user;

        if ($this->post_id) {
            return Gate::forUser($user)->allows('toggleFavoritePost', $targetUser);
        }

        if ($this->recipe_id) {
            return Gate::forUser($user)->allows('toggleFavoriteRecipe', $targetUser);
        }

        return false;
    }

    public function rules(): array
    {
        return [
            'post_id' => 'sometimes|required|exists:posts,id',
            'recipe_id' => 'sometimes|required|exists:recipes,id',
        ];
    }
}
