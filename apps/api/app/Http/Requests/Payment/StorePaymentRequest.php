<?php

namespace App\Http\Requests\Payment;

use App\Models\Payment;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', Payment::class);
    }

    public function rules(): array
    {
        return [
            'subscription_id' => 'required|integer|exists:subscriptions,id',
            'payment_method_id' => 'required|integer|exists:payment_methods,id',
            'amount' => 'required|numeric|gt:0',
            'status' => ['sometimes', 'required', 'string', Rule::in(['pending', 'paid', 'failed'])],
            'due_date' => 'required|date',
            'paid_at' => 'nullable|date|required_if:status,paid',
            'notes' => 'nullable|string|max:1000',
        ];
    }
}
