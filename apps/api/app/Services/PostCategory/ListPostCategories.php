<?php

namespace App\Services\PostCategory;

use App\Models\PostCategory;
use App\Services\Concerns\ListTaxonomyService;

class ListPostCategories
{
    use ListTaxonomyService;

    protected function getModelClass(): string
    {
        return PostCategory::class;
    }

    protected function getCacheTag(): string
    {
        return 'post_categories';
    }
}
