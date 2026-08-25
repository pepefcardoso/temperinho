<?php

namespace App\Http\Requests\RecipeDiet;

use App\Http\Requests\Concerns\HasStandardFiltering;
use App\Models\RecipeDiet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class FilterRecipeDietRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return Gate::allows('viewAny', RecipeDiet::class);
    }

    public function rules(): array
    {
        return $this->getStandardFilterRules([], RecipeDiet::VALID_SORT_COLUMNS);
    }
}
