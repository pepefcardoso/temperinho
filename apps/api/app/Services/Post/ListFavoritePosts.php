<?php

namespace App\Services\Post;

use App\Models\Post;
use App\Services\Concerns\HasUserContentListing;

class ListFavoritePosts
{
    use HasUserContentListing;

    protected function getModelClass(): string
    {
        return Post::class;
    }

    protected function getFavoriteRelationshipName(): string
    {
        return 'favoritePosts';
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
