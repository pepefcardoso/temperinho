<?php

namespace App\Services\Rating;

use App\Models\Rating;
use App\Services\Concerns\BaseListService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class ListRatings
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return Rating::class;
    }

    protected function getValidSortColumns(): array
    {
        return ['id', 'created_at', 'rating'];
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
