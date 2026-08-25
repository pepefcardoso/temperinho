<?php

namespace App\Services\PostTopic;

use App\Models\PostTopic;
use App\Services\Concerns\ListTaxonomyService;

class ListPostTopics
{
    use ListTaxonomyService;

    protected function getModelClass(): string
    {
        return PostTopic::class;
    }

    protected function getCacheTag(): string
    {
        return 'post_topics';
    }
}
