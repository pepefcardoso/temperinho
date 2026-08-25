<?php

namespace App\Http\Requests\Post;

use App\Http\Requests\Concerns\HasStandardFiltering;
use App\Models\Post;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class FilterPostRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return Gate::allows('viewAny', Post::class);
    }

    public function rules(): array
    {
        $customOrderByOptions = Post::VALID_SORT_COLUMNS;

        return $this->getStandardFilterRules([
            'category_id' => 'nullable|integer|exists:post_categories,id',
        ], $customOrderByOptions);
    }
}
