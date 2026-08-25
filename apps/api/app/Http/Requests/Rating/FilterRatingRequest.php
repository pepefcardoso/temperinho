<?php

namespace App\Http\Requests\Rating;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Requests\Concerns\HasStandardFiltering;

class FilterRatingRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        if ($this->route('type') && $this->route('rateableId')) {
            $this->merge([
                'rateable_type' => 'App\\Models\\' . \Illuminate\Support\Str::studly(\Illuminate\Support\Str::singular($this->route('type'))),
                'rateable_id' => $this->route('rateableId'),
            ]);
        }
    }

    public function rules(): array
    {
        return array_merge($this->getStandardFilterRules(), [
            'rateable_type' => 'sometimes|string',
            'rateable_id' => 'sometimes|integer',
        ]);
    }
}
