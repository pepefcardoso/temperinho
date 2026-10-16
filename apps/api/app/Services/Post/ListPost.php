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

    protected function applyBaseScope($query)
    {
        $user = auth('sanctum')->user();

        if ($user && $user->isInternal()) {
            return $query;
        }

        return $query->where('status', Post::STATUS_PUBLISHED);
    }

    protected function getCustomSearchFilters(array $filters): array
    {
        $user = auth('sanctum')->user();

        if ($user && $user->isInternal()) {
            return [];
        }

        return ['status = "' . Post::STATUS_PUBLISHED . '"'];
    }
}
