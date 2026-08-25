<?php

namespace App\Http\Requests\Recipe;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;

class UpdateRecipeRequest extends FormRequest
{
    public function authorize(): bool
    {
        $recipe = Route::current()->parameter('recipe');
        return Gate::allows('update', $recipe);
    }

    public function rules(): array
    {
        $rules = (new StoreRecipeRequest())->rules();
        $rules['image'] = 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048';
        return $rules;
    }
}
