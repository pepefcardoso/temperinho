<?php

namespace App\Http\Requests\Payment;

use App\Http\Requests\Concerns\HasStandardFiltering;
use Illuminate\Foundation\Http\FormRequest;

class FilterPaymentRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return $this->getStandardFilterRules([
            'subscription_id' => 'nullable|integer|exists:subscriptions,id',
            'status' => 'nullable|string|in:pending,paid,failed,refunded',
        ], ['created_at', 'amount']);
    }
}
