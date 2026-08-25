<?php

namespace App\Http\Requests\User;

use App\Enum\RolesEnum;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;

class UpdateUserRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $targetUser = $this->route('user');
        return Gate::allows('updateRole', $targetUser);
    }

    public function rules(): array
    {
        $roleValues = array_map(fn($case) => $case->value, RolesEnum::cases());

        return [
            'role' => ['required', Rule::in($roleValues)],
        ];
    }
}
