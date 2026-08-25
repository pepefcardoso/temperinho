<?php

namespace App\Services\Post;

use App\Models\Post;
use App\Services\Concerns\HasUserContentListing;

class ListUserPosts
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
            'image' => fn($q) => $q->select('id', 'imageable_id', 'imageable_type', 'name', 'file_name'),
            'topics:id,name',
            'category:id,name',
            'user:id,name'
        ];
    }

    public function list(int $userId, $perPage = 10)
    {
        return $this->listUserContent($userId, $perPage);
    }
}
