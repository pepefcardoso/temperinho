<?php

namespace App\Services\PostCategory;

use App\Models\PostCategory;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class DeletePostCategory
{
    public function delete(PostCategory $category): void
    {
        if ($category->posts()->exists()) {
            throw ValidationException::withMessages(['category' => 'This category is in use and cannot be deleted.']);
        }

        $category->delete();

        Cache::tags('post_categories')->flush();
    }
}
