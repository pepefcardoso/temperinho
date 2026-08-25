<?php

namespace App\Http\Requests\Plan;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;

class UpdatePlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        $plan = Route::current()->parameter('plan');

        return Gate::allows('update', $plan);
    }

    public function rules(): array
    {
        $plan = Route::current()->parameter('plan');

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('plans')->ignore($plan?->id)],
            'badge' => ['sometimes', 'nullable', 'string', 'max:255'],
            'price' => ['sometimes', 'required', 'integer', 'min:0'],
            'period' => ['sometimes', 'required', 'string', Rule::in(['monthly', 'yearly'])],
            'description' => ['sometimes', 'nullable', 'string'],
            'features' => ['sometimes', 'nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'status' => ['sometimes', 'nullable', 'string', Rule::in(['active', 'archived', 'draft'])],
            'display_order' => ['sometimes', 'nullable', 'integer'],
            'max_users' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'max_posts' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'max_recipes' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'max_banners' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'max_email_campaigns' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'newsletter' => ['sometimes', 'nullable', 'boolean'],
            'trial_days' => ['sometimes', 'nullable', 'integer', 'min:0'],
            'is_popular' => ['sometimes', 'nullable', 'boolean'],
        ];
    }
}
