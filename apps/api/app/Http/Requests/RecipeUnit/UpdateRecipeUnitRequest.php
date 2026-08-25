<?php

namespace App\Http\Requests\RecipeUnit;

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
class UpdateRecipeUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        $unit = Route::current()->parameter('recipe_unit');
        return Gate::allows('update', $unit);
    }

    protected function prepareForValidation()
    {
        if ($this->name) {
            $this->merge(['normalized_name' => Str::upper($this->name)]);
        }
    }

    public function rules(): array
    {
        $unitId = Route::current()->parameter('recipe_unit')->id;

        return [
            'name' => ['required', 'string', 'max:50', Rule::unique('recipe_units')->ignore($unitId)],
            'normalized_name' => ['required', 'string', 'max:50', Rule::unique('recipe_units')->ignore($unitId)],
        ];
    }
}
