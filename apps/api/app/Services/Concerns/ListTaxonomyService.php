<?php

namespace App\Services\Concerns;

use Illuminate\Support\Facades\Cache;

trait ListTaxonomyService
{
    abstract protected function getModelClass(): string;
    abstract protected function getCacheTag(): string;

    public function list(array $filters = [], int $perPage = 15)
    {
        $modelClass = $this->getModelClass();
        $query = $modelClass::query();

        // Ensure stable cache key by sorting the filter keys
        ksort($filters);
        $cacheKey = "{$this->getCacheTag()}:list:" . http_build_query($filters) . "&per_page={$perPage}";

        return Cache::tags($this->getCacheTag())->remember(
            $cacheKey,
            now()->addHour(),
            function () use ($query, $filters, $perPage) {
                $query->filter($filters);

                $orderBy = $filters['order_by'] ?? 'name';
                $orderDirection = $filters['order_direction'] ?? 'asc';

                return $query->orderBy($orderBy, $orderDirection)->paginate($perPage);
            }
        );
    }
}
