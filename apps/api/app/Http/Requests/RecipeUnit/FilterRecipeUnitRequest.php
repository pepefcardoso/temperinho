<?php

namespace App\Http\Requests\RecipeUnit;

use App\Http\Requests\Concerns\HasStandardFiltering;
use App\Models\RecipeUnit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class FilterRecipeUnitRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return Gate::allows('viewAny', RecipeUnit::class);
    }

    public function rules(): array
    {
        return $this->getStandardFilterRules([], RecipeUnit::VALID_SORT_COLUMNS);
    }
}
