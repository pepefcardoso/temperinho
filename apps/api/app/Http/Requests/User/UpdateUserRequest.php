<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        $userToUpdate = Route::current()->parameter('user');
        return Gate::allows('update', $userToUpdate);
    }

    public function rules(): array
    {
        $userId = Route::current()->parameter('user')->id;

        return [
            'name' => 'sometimes|required|string|min:3|max:100',
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('users')->ignore($userId),
            ],
            'phone' => [
                'sometimes',
                'required',
                'string',
                'regex:/^\d{10,11}$/',
                Rule::unique('users')->ignore($userId),
            ],
            'birthday' => 'nullable|date|before_or_equal:' . now()->subYears(18)->format('Y-m-d'),
            'password' => 'nullable|string|min:8|max:99|confirmed',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'birthday.before_or_equal' => 'O usuário deve ter pelo menos 18 anos.',
        ];
    }
}
