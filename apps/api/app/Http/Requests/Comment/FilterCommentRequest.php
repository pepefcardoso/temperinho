<?php

namespace App\Http\Requests\Comment;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\Concerns\HasStandardFiltering;

class FilterCommentRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        if ($this->route('type') && $this->route('commentableId')) {
            $this->merge([
                'commentable_type' => 'App\\Models\\' . \Illuminate\Support\Str::studly(\Illuminate\Support\Str::singular($this->route('type'))),
                'commentable_id' => $this->route('commentableId'),
            ]);
        }
    }

    public function rules(): array
    {
        return array_merge($this->getStandardFilterRules(), [
            'commentable_type' => 'sometimes|string',
            'commentable_id' => 'sometimes|integer',
        ]);
    }
}
