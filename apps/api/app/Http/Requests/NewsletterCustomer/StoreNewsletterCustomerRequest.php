<?php

namespace App\Http\Requests\NewsletterCustomer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use App\Models\NewsletterCustomer;

class StoreNewsletterCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Gate::allows('create', NewsletterCustomer::class);
    }

    public function rules(): array
    {
        return ['email' => 'required|email|max:255|unique:newsletter_customers,email'];
    }
}
