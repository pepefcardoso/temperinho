<?php

namespace App\Http\Requests\User;

use App\Http\Requests\Concerns\HasStandardFiltering;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class FilterUsersRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return Gate::allows('viewAny', User::class);
    }

    public function rules(): array
    {
        return $this->getStandardFilterRules([
            'role' => 'nullable|array',
            'role.*' => 'integer',
            'birthday_start' => 'nullable|date',
            'birthday_end' => 'nullable|date|after_or_equal:birthday_start',
        ], ['name', 'email', 'created_at']);
    }
}
