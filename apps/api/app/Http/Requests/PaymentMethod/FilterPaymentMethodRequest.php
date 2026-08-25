<?php

namespace App\Http\Requests\PaymentMethod;

use App\Http\Requests\Concerns\HasStandardFiltering;
use Illuminate\Foundation\Http\FormRequest;

class FilterPaymentMethodRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return $this->getStandardFilterRules([
            'is_active' => 'nullable|boolean',
            'provider' => 'nullable|string|max:255',
        ], ['created_at']);
    }
}
