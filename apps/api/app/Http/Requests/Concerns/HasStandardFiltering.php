<?php

namespace App\Http\Requests\Concerns;

trait HasStandardFiltering
{
    protected function getStandardFilterRules(array $additionalRules = [], array $customOrderByOptions = ['title', 'created_at']): array
    {
        $baseRules = [
            'search' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'category_id' => 'nullable|integer',
            'order_by' => 'nullable|string|in:' . implode(',', $customOrderByOptions),
            'order_direction' => 'nullable|string|in:asc,desc',
            'user_id' => 'nullable|integer|exists:users,id',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];

        return array_merge($baseRules, $additionalRules);
    }
}
