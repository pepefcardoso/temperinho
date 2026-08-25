<?php

namespace App\Services\Post;

use App\Models\Post;
use App\Services\Concerns\BaseListService;

class ListPost
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return Post::class;
    }

    protected function getValidSortColumns(): array
    {
        return Post::VALID_SORT_COLUMNS;
    }

    protected function getDefaultRelations(): array
    {
        return ['user', 'category', 'topics', 'image'];
    }

    protected function applySearchFilters($query, string $searchTerm, array $filters)
    {
        return $query;
    }

    protected function getCustomSearchFilters(array $filters): array
    {
        return [];
    }
}
