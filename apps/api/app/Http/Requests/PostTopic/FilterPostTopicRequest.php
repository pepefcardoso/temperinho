<?php

namespace App\Http\Requests\PostTopic;

use App\Http\Requests\Concerns\HasStandardFiltering;
use App\Models\PostTopic;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class FilterPostTopicRequest extends FormRequest
{
    use HasStandardFiltering;

    public function authorize(): bool
    {
        return Gate::allows('viewAny', PostTopic::class);
    }

    public function rules(): array
    {
        return $this->getStandardFilterRules([], PostTopic::VALID_SORT_COLUMNS);
    }
}
