<?php

namespace App\Services\Report;

use App\Models\Report;
use App\Services\Concerns\BaseListService;

class ListReports
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return Report::class;
    }

    protected function getValidSortColumns(): array
    {
        return Report::VALID_SORT_COLUMNS;
    }

    protected function applySearchFilters($query, string $searchTerm, array $filters)
    {
        // Não pesquisável via scout
    }

    protected function getDefaultRelations(): array
    {
        return ['user:id,name', 'reportable'];
    }
}
