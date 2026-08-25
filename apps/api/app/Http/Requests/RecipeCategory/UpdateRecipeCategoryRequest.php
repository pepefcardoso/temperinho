<?php

namespace App\Http\Requests\RecipeCategory;

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
class UpdateRecipeCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        $category = Route::current()->parameter('recipe_category');

        return Gate::allows('update', $category);
    }

    protected function prepareForValidation()
    {
        if ($this->name) {
            $this->merge(['normalized_name' => Str::upper($this->name)]);
        }
    }

    public function rules(): array
    {
        $categoryId = Route::current()->parameter('recipe_category')->id;

        return [
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('recipe_categories')->ignore($categoryId),
            ],
            'normalized_name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('recipe_categories')->ignore($categoryId),
            ],
        ];
    }
}
