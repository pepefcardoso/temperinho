<?php

namespace App\Http\Requests\Image;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\Concerns\HasStandardFiltering;

class FilterImageRequest extends FormRequest
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
