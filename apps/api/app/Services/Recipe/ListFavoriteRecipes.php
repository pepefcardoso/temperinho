<?php

namespace App\Services\Recipe;

use App\Models\Recipe;
use App\Services\Concerns\HasUserContentListing;

class ListFavoriteRecipes
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
            'image' => fn($q) => $q->select('id', 'imageable_id', 'imageable_type', 'created_at', 'updated_at'),
        ];
    }

    public function list(int $userId, int $perPage = 10)
    {
        return $this->listUserFavorites($userId, $perPage);
    }
}
