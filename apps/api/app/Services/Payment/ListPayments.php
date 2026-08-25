<?php

namespace App\Services\Payment;

use App\Models\Payment;
use App\Services\Concerns\BaseListService;

class ListPayments
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return Payment::class;
    }

    protected function getValidSortColumns(): array
    {
        return Payment::VALID_SORT_COLUMNS;
    }

    protected function getDefaultRelations(): array
    {
        return ['subscription', 'method'];
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
