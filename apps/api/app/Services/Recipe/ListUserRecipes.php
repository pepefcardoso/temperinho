<?php

namespace App\Services\Recipe;

use App\Models\Recipe;
use App\Services\Concerns\HasUserContentListing;

class ListUserRecipes
{
    use HasUserContentListing;

    protected function getModelClass(): string
    {
        return Recipe::class;
    }

    protected function getFavoriteRelationshipName(): string
    {
        return 'favoriteRecipes';
    }

    protected function getUserContentRelations(): array
    {
        return [
            'image' => fn($q) => $q->select('id', 'imageable_id', 'imageable_type', 'name', 'file_name'),
        ];
    }

    public function list(int $userId, $perPage = 10)
    {
        return $this->listUserContent($userId, $perPage);
    }
}
