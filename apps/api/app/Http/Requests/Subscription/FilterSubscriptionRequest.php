<?php

namespace App\Http\Requests\Subscription;

use App\Http\Requests\Concerns\HasStandardFiltering;
use Illuminate\Foundation\Http\FormRequest;

class FilterSubscriptionRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return $this->getStandardFilterRules([
            'company_id' => 'nullable|integer|exists:companies,id',
            'status' => 'nullable|string|in:active,canceled,expired',
        ], ['created_at', 'starts_at', 'ends_at']);
    }
}
