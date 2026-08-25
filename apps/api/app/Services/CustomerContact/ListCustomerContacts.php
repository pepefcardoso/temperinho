<?php

namespace App\Services\CustomerContact;

use App\Models\CustomerContact;
use App\Services\Concerns\BaseListService;

class ListCustomerContacts
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return CustomerContact::class;
    }

    protected function getValidSortColumns(): array
    {
        return ['id', 'name', 'created_at', 'status'];
    }

    protected function applySearchFilters($query, string $searchTerm, array $filters)
    {
        // Meilisearch logic if searchable, but model is not currently searchable
    }

    protected function getDefaultRelations(): array
    {
        return [];
    }
}
