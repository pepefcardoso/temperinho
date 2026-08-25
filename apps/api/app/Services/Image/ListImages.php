<?php

namespace App\Services\Image;

use App\Models\Image;
use App\Services\Concerns\BaseListService;

class ListImages
{
    use BaseListService;

    protected function getModelClass(): string
    {
        return Image::class;
    }

    protected function getValidSortColumns(): array
    {
        return ['id', 'name', 'created_at'];
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
