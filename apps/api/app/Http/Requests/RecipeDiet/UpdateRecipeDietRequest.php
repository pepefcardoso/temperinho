<?php

namespace App\Http\Requests\RecipeDiet;

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
class UpdateRecipeDietRequest extends FormRequest
{
    public function authorize(): bool
    {
        $diet = Route::current()->parameter('recipe_diet');

        return Gate::allows('update', $diet);
    }

    protected function prepareForValidation()
    {
        if ($this->name) {
            $this->merge(['normalized_name' => Str::upper($this->name)]);
        }
    }

    public function rules(): array
    {
        $dietId = Route::current()->parameter('recipe_diet')->id;

        return [
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('recipe_diets')->ignore($dietId),
            ],
            'normalized_name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('recipe_diets')->ignore($dietId),
            ],
        ];
    }
}
