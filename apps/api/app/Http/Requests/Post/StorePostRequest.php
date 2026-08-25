<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', \App\Models\Post::class);
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:100',
            'summary' => 'required|string|max:255',
            'content' => 'required|string',
            'category_id' => 'required|exists:post_categories,id',
            'topics' => 'array|required',
            'topics.*' => 'exists:post_topics,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];
    }
}
