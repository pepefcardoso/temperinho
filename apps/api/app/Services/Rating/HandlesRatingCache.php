<?php

namespace App\Services\Rating;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

trait HandlesRatingCache
{
    protected function getCacheTagsForRateable(Model $rateable): array
    {
        $type = $rateable->getMorphClass();
        return ["ratings:{$type}:{$rateable->id}", 'ratings'];
    }

    protected function flushRateableCache(Model $rateable): void
    {
        Cache::tags($this->getCacheTagsForRateable($rateable))->flush();
    }
}
