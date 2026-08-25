<?php

namespace App\Http\Requests\Comment;

use App\Models\Comment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', Comment::class);
    }

    public function rules(): array
    {
        return ['content' => 'required|string|max:1000'];
    }
}
