<?php

namespace App\Http\Requests\RecipeCategory;

use App\Http\Requests\Concerns\HasStandardFiltering;
use App\Models\RecipeCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class FilterRecipeCategoryRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return Gate::allows('viewAny', RecipeCategory::class);
    }

    public function rules(): array
    {
        return $this->getStandardFilterRules([], RecipeCategory::VALID_SORT_COLUMNS);
    }
}
