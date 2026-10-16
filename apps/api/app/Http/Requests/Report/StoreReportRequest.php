<?php

namespace App\Http\Requests\Report;

use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // route already requires auth:sanctum
    }

    public function rules(): array
    {
        return [
            'reason' => 'required|string|in:' . implode(',', Report::REASONS),
            'comment' => 'nullable|string|max:1000',
        ];
    }
}
