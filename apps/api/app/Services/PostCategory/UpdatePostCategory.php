<?php

namespace App\Services\PostCategory;

use App\Models\PostCategory;
use Illuminate\Support\Facades\Cache;

class UpdatePostCategory
{
    public function update(PostCategory $category, array $data): PostCategory
    {
        $category->update($data);

        Cache::tags('post_categories')->flush();

        return $category;
    }
}
