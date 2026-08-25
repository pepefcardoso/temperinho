<?php

namespace App\Services\Company;

use App\Models\Company;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

use App\Services\Concerns\BaseListService;

class ListCompanies
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return Company::class;
    }

    protected function getValidSortColumns(): array
    {
        return ['id', 'name', 'created_at'];
    }

    protected function applySearchFilters($query, string $searchTerm, array $filters)
    {
        // Handled by BaseListService for Meilisearch, but Company doesn't need to override
    }

    protected function getDefaultRelations(): array
    {
        return ['image'];
    }
}
