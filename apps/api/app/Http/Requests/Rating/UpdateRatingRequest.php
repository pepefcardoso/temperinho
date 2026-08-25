<?php

namespace App\Http\Requests\Rating;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;

class UpdateRatingRequest extends FormRequest
{
    public function authorize(): bool
    {
        $rating = Route::current()->parameter('rating');
        return Gate::allows('update', $rating);
    }

    public function rules(): array
    {
        return ['rating' => 'required|integer|min:1|max:5'];
    }
}
