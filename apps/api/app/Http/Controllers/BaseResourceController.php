<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

abstract class BaseResourceController extends BaseController
{
    abstract protected function getFilterRequestClass(): string;

    abstract protected function getListServiceClass(): string;

    abstract protected function getCollectionResourceClass(): string;

    protected function standardIndex($request): AnonymousResourceCollection
    {
        $filters = $request->validated();
        $perPage = $filters['per_page'] ?? 10;

        $listServiceClass = $this->getListServiceClass();
        $collectionResourceClass = $this->getCollectionResourceClass();

        $service = app($listServiceClass);
        $items = $service->list($filters, $perPage);

        return $collectionResourceClass::collection($items);
    }
}
