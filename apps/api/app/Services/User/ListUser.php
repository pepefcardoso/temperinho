<?php

namespace App\Services\User;

use App\Models\User;

use App\Services\Concerns\BaseListService;

class ListUser
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return User::class;
    }

    protected function getValidSortColumns(): array
    {
        return ['id', 'name', 'created_at', 'role'];
    }

    protected function applySearchFilters($query, string $searchTerm, array $filters)
    {
        // Handled by BaseListService for Meilisearch
    }

    protected function getDefaultRelations(): array
    {
        return ['image'];
    }
}
