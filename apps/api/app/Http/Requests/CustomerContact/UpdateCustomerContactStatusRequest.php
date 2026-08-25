<?php

namespace App\Http\Requests\CustomerContact;

use App\Enum\CustomerContactStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;

class UpdateCustomerContactStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        $contact = Route::current()->parameter('customer_contact');

        return Gate::allows('update', $contact);
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'integer', Rule::in(array_column(CustomerContactStatusEnum::cases(), 'value'))],
        ];
    }
}
