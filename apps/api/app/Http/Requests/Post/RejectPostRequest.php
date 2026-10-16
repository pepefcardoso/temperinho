<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;

class RejectPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('reject', Route::current()->parameter('post'));
    }

    public function rules(): array
    {
        return [
            'reason' => 'required|string|max:1000',
        ];
    }
}
