<?php

namespace App\Http\Requests\PostCategory;

use App\Http\Requests\Concerns\HasStandardFiltering;
use App\Models\PostCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class FilterPostCategoryRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return Gate::allows('viewAny', PostCategory::class);
    }

    public function rules(): array
    {
        return $this->getStandardFilterRules([], PostCategory::VALID_SORT_COLUMNS);
    }
}
