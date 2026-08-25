<?php

namespace App\Http\Requests\Plan;

use App\Models\Plan;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StorePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', Plan::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:plans,name'],
            'badge' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:0'],
            'period' => ['required', 'string', Rule::in(['monthly', 'yearly'])],
            'description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'status' => ['nullable', 'string', Rule::in(['active', 'archived', 'draft'])],
            'display_order' => ['nullable', 'integer'],
            'max_users' => ['nullable', 'integer', 'min:0'],
            'max_posts' => ['nullable', 'integer', 'min:0'],
            'max_recipes' => ['nullable', 'integer', 'min:0'],
            'max_banners' => ['nullable', 'integer', 'min:0'],
            'max_email_campaigns' => ['nullable', 'integer', 'min:0'],
            'newsletter' => ['nullable', 'boolean'],
            'is_popular' => ['nullable', 'boolean'],
            'trial_days' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
