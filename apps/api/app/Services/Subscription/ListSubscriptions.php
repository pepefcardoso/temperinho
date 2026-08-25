<?php

namespace App\Services\Subscription;

use App\Models\Subscription;
use App\Services\Concerns\BaseListService;

class ListSubscriptions
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return Subscription::class;
    }

    protected function getValidSortColumns(): array
    {
        return Subscription::VALID_SORT_COLUMNS;
    }

    protected function getDefaultRelations(): array
    {
        return ['company', 'plan'];
    }

    protected function applySearchFilters($query, string $searchTerm, array $filters)
    {
        return $query;
    }

    protected function addRelationsAndPaginate($query, int $perPage)
    {
        if (method_exists($query, 'query')) {
            $query->query(function ($builder) {
                $builder->with($this->getDefaultRelations());
            });
        } else {
            $query->with($this->getDefaultRelations());
        }

        return $query->paginate($perPage);
    }
}
