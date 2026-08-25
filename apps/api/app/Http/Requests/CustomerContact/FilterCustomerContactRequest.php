<?php

namespace App\Http\Requests\CustomerContact;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\Concerns\HasStandardFiltering;

class FilterCustomerContactRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return array_merge($this->getStandardFilterRules(), [
            'status' => 'sometimes|string',
        ]);
    }
}
