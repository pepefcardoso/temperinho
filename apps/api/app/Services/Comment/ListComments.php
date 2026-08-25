<?php

namespace App\Services\Comment;

use App\Models\Comment;

use App\Services\Concerns\BaseListService;

class ListComments
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return Comment::class;
    }

    protected function getValidSortColumns(): array
    {
        return ['id', 'created_at'];
    }

    protected function applySearchFilters($query, string $searchTerm, array $filters)
    {
        // Not searchable via scout
    }

    protected function getDefaultRelations(): array
    {
        return ['user.image'];
    }
}
