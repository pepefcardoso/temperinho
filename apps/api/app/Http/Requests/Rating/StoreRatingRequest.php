<?php

namespace App\Http\Requests\Rating;

use App\Models\Rating;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StoreRatingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', Rating::class);
    }

    public function rules(): array
    {
        return ['rating' => 'required|integer|min:1|max:5'];
    }
}
