<?php

namespace App\Services\NewsletterCustomer;

use App\Models\NewsletterCustomer;
use App\Services\Concerns\BaseListService;

class ListNewsletterCustomers
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return NewsletterCustomer::class;
    }

    protected function getValidSortColumns(): array
    {
        return ['id', 'email', 'created_at'];
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
