<?php

namespace App\Http\Requests\PostTopic;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

/**
 * @property string $name
 * @mixin \Illuminate\Http\Request
 * @method void merge(array $input)
 */
class UpdatePostTopicRequest extends FormRequest
{
    public function authorize(): bool
    {
        $topic = Route::current()->parameter('post_topic');
        return Gate::allows('update', $topic);
    }
    protected function prepareForValidation()
    {
        if ($this->name) {
            $this->merge(['normalized_name' => Str::upper($this->name)]);
        }
    }
    public function rules(): array
    {
        $topicId = Route::current()->parameter('post_topic')->id;

        return [
            'name' => ['required', 'string', 'max:50', Rule::unique('post_topics')->ignore($topicId)],
            'normalized_name' => ['required', 'string', 'max:50', Rule::unique('post_topics')->ignore($topicId)],
        ];
    }
}
