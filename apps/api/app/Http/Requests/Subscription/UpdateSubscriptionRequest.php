<?php

namespace App\Http\Requests\Subscription;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;

class UpdateSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $subscription = Route::current()->parameter('subscription');
        return Gate::allows('update', $subscription);
    }

    public function rules(): array
    {
        return [
            'plan_id' => 'sometimes|required|exists:plans,id',
            'starts_at' => 'sometimes|required|date',
            'ends_at' => 'sometimes|required|date|after:starts_at',
            'status' => 'sometimes|required|in:active,canceled,expired',
        ];
    }
}
