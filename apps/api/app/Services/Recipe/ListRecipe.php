<?php

namespace App\Services\Recipe;

use App\Models\Recipe;
use App\Services\Concerns\BaseListService;

class ListRecipe
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return Recipe::class;
    }

    protected function getValidSortColumns(): array
    {
        return Recipe::VALID_SORT_COLUMNS;
    }

    protected function getDefaultRelations(): array
    {
        return ['diets', 'category', 'image'];
    }

    protected function applySearchFilters($query, string $searchTerm, array $filters)
    {
        return $query;
    }

    protected function getCustomSearchFilters(array $filters): array
    {
        $customFilters = [];

        if (!empty($filters['diets']) && is_array($filters['diets'])) {
            $diets = implode(', ', array_map('intval', $filters['diets']));
            $customFilters[] = 'diets IN [' . $diets . ']';
        }

        return $customFilters;
    }
}
