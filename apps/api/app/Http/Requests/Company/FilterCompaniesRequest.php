<?php

namespace App\Http\Requests\Company;

use App\Http\Requests\Concerns\HasStandardFiltering;
use App\Models\Company;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class FilterCompaniesRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return Gate::allows('viewAny', Company::class);
    }

    public function rules(): array
    {
        return $this->getStandardFilterRules([], ['name', 'cnpj', 'phone', 'email', 'created_at']);
    }
}
