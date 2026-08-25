<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecipeDiet\FilterRecipeDietRequest;
use App\Http\Requests\RecipeDiet\StoreRecipeDietRequest;
use App\Http\Requests\RecipeDiet\UpdateRecipeDietRequest;
use App\Http\Resources\RecipeDiet\RecipeDietCollectionResource;
use App\Http\Resources\RecipeDiet\RecipeDietResource;
use App\Models\RecipeDiet;
use App\Services\RecipeDiet\CreateRecipeDiet;
use App\Services\RecipeDiet\DeleteRecipeDiet;
use App\Services\RecipeDiet\ListRecipeDiets;
use App\Services\RecipeDiet\UpdateRecipeDiet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RecipeDietController extends BaseResourceController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    protected function getFilterRequestClass(): string
    {
        return FilterRecipeDietRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListRecipeDiets::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return RecipeDietCollectionResource::class;
    }

    public function index(FilterRecipeDietRequest $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', RecipeDiet::class);

        return $this->standardIndex($request);
    }

    public function store(StoreRecipeDietRequest $request, CreateRecipeDiet $service): JsonResponse
    {
        $diet = $service->create($request->validated());

        return (new RecipeDietResource($diet))
            ->response()
            ->setStatusCode(201);
    }

    public function show(RecipeDiet $recipeDiet): RecipeDietResource
    {
        $this->authorize('view', $recipeDiet);

        return new RecipeDietResource($recipeDiet);
    }

    public function update(UpdateRecipeDietRequest $request, RecipeDiet $recipeDiet, UpdateRecipeDiet $service): RecipeDietResource
    {
        $updatedDiet = $service->update($recipeDiet, $request->validated());

        return new RecipeDietResource($updatedDiet);
    }

    public function destroy(RecipeDiet $recipeDiet, DeleteRecipeDiet $service): JsonResponse
    {
        $this->authorize('delete', $recipeDiet);

        $service->delete($recipeDiet);

        return response()->json(null, 204);
    }
}
