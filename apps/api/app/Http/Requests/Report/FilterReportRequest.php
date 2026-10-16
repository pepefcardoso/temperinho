<?php

namespace App\Http\Requests\Report;

use App\Http\Requests\Concerns\HasStandardFiltering;
use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class FilterReportRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return Gate::allows('viewAny', Report::class);
    }

    public function rules(): array
    {
        return $this->getStandardFilterRules([
            'status' => 'nullable|string|in:pending,reviewed',
        ], Report::VALID_SORT_COLUMNS);
    }
}
