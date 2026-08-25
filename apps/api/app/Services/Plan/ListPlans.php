<?php

namespace App\Services\Plan;

use App\Models\Plan;
use App\Services\Concerns\BaseListService;

class ListPlans
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return Plan::class;
    }

    protected function getValidSortColumns(): array
    {
        return ['id', 'name', 'price', 'display_order', 'created_at'];
    }

    protected function applySearchFilters($query, string $searchTerm, array $filters)
    {
        // Not used
    }

    protected function getDefaultRelations(): array
    {
        return [];
    }
}
