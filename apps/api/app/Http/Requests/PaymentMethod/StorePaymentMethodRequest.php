<?php

namespace App\Http\Requests\PaymentMethod;

use App\Models\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class StorePaymentMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', PaymentMethod::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:payment_methods,name'],
            'slug' => ['required', 'string', 'max:255', 'unique:payment_methods,slug'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
