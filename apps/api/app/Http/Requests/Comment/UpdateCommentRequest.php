<?php

namespace App\Http\Requests\Comment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;

class UpdateCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $comment = Route::current()->parameter('comment');

        return Gate::allows('update', $comment);
    }

    public function rules(): array
    {
        return ['content' => 'required|string|max:1000'];
    }
}
