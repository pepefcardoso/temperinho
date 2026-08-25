<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;

class UpdatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $payment = Route::current()->parameter('payment');

        return Gate::allows('update', $payment);
    }

    public function rules(): array
    {
        return [
            'payment_method_id' => 'sometimes|required|integer|exists:payment_methods,id',
            'amount' => 'sometimes|required|numeric|gt:0',
            'status' => ['sometimes', 'required', 'string', Rule::in(['pending', 'paid', 'failed'])],
            'due_date' => 'sometimes|required|date',
            'paid_at' => 'nullable|date|required_if:status,paid',
            'notes' => 'nullable|string|max:1000',
        ];
    }
}
