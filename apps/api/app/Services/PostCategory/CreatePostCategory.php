<?php

namespace App\Services\PostCategory;

use App\Models\PostCategory;
use Illuminate\Support\Facades\Cache;

class CreatePostCategory
{
    public function create(array $data): PostCategory
    {
        $category = PostCategory::create($data);

        Cache::tags('post_categories')->flush();

        return $category;
    }
}
