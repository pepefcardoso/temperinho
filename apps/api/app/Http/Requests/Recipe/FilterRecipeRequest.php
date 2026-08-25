<?php

namespace App\Http\Requests\Recipe;

use App\Http\Requests\Concerns\HasStandardFiltering;
use App\Models\Recipe;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class FilterRecipeRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return Gate::allows('viewAny', Recipe::class);
    }

    public function rules(): array
    {
        $customOrderByOptions = Recipe::VALID_SORT_COLUMNS;

        return $this->getStandardFilterRules([
            'category_id' => 'nullable|integer|exists:recipe_categories,id',
            'diets' => 'nullable|array',
            'diets.*' => 'integer|exists:recipe_diets,id',
        ], $customOrderByOptions);
    }
}
