<?php

namespace App\Services\PaymentMethod;

use App\Models\PaymentMethod;
use App\Services\Concerns\BaseListService;

class ListPaymentMethods
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return PaymentMethod::class;
    }

    protected function getValidSortColumns(): array
    {
        return PaymentMethod::VALID_SORT_COLUMNS;
    }

    protected function getDefaultRelations(): array
    {
        return [];
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
