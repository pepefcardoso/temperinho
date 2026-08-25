<?php

namespace App\Http\Requests\Plan;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\Concerns\HasStandardFiltering;

class FilterPlanRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return $this->getStandardFilterRules();
    }
}
