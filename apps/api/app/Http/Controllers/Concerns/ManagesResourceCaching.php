<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

trait ManagesResourceCaching
{
    abstract protected function getCacheTag(): string;

    protected function getCachedAndPaginated(
        Request $request,
        Builder $query,
        array $relations = [],
        string $searchColumn = 'name'
    ) {
        $perPage = $request->input('per_page', 15);
        $orderBy = $request->input('order_by', $searchColumn);
        $orderDirection = $request->input('order_direction', 'asc');
        $search = $request->input('search', '');

        $queryParams = $request->query();
        if (!empty($relations)) {
            $queryParams['with'] = implode(',', $relations);
        }

        $cacheKey = "{$this->getCacheTag()}:list:" . http_build_query($queryParams);

        if (!empty($relations)) {
            $query->with($relations);
        }

        if (!empty($search)) {
            $query->where($searchColumn, 'like', "%{$search}%");
        }

        return Cache::tags($this->getCacheTag())->remember(
            $cacheKey,
            now()->addHour(),
            function () use ($query, $orderBy, $orderDirection, $perPage) {
                return $query->orderBy($orderBy, $orderDirection)->paginate($perPage);
            }
        );
    }

    protected function flushResourceCache(): void
    {
        Cache::tags($this->getCacheTag())->flush();
    }
}
