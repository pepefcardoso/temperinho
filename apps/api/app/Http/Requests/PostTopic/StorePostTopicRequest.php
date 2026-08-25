<?php

namespace App\Http\Requests\PostTopic;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

/**
 * @property string $name
 * @mixin \Illuminate\Http\Request
 * @method void merge(array $input)
 */
class StorePostTopicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', \App\Models\PostTopic::class);
    }

    protected function prepareForValidation()
    {
        if ($this->name) {
            $this->merge(['normalized_name' => Str::upper($this->name)]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:50|unique:post_topics',
            'normalized_name' => 'required|string|max:50|unique:post_topics',
        ];
    }
}
