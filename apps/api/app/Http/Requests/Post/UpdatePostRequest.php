<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        $post = Route::current()->parameter('post');

        return Gate::allows('update', $post);
    }

    public function rules(): array
    {
        $rules = (new StorePostRequest())->rules();
        $rules['image'] = 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048';
        return $rules;
    }
}
