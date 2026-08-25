<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecipeUnit\FilterRecipeUnitRequest;
use App\Http\Requests\RecipeUnit\StoreRecipeUnitRequest;
use App\Http\Requests\RecipeUnit\UpdateRecipeUnitRequest;
use App\Http\Resources\RecipeUnit\RecipeUnitCollectionResource;
use App\Http\Resources\RecipeUnit\RecipeUnitResource;
use App\Models\RecipeUnit;
use App\Services\RecipeUnit\CreateRecipeUnit;
use App\Services\RecipeUnit\DeleteRecipeUnit;
use App\Services\RecipeUnit\ListRecipeUnits;
use App\Services\RecipeUnit\UpdateRecipeUnit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RecipeUnitController extends BaseResourceController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    protected function getFilterRequestClass(): string
    {
        return FilterRecipeUnitRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListRecipeUnits::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return RecipeUnitCollectionResource::class;
    }

    public function index(FilterRecipeUnitRequest $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', RecipeUnit::class);

        return $this->standardIndex($request);
    }

    public function store(StoreRecipeUnitRequest $request, CreateRecipeUnit $service): JsonResponse
    {
        $unit = $service->create($request->validated());

        return (new RecipeUnitResource($unit))
            ->response()
            ->setStatusCode(201);
    }

    public function show(RecipeUnit $recipeUnit): RecipeUnitResource
    {
        $this->authorize('view', $recipeUnit);

        return new RecipeUnitResource($recipeUnit);
    }

    public function update(UpdateRecipeUnitRequest $request, RecipeUnit $recipeUnit, UpdateRecipeUnit $service): RecipeUnitResource
    {
        $updatedUnit = $service->update($recipeUnit, $request->validated());

        return new RecipeUnitResource($updatedUnit);
    }

    public function destroy(RecipeUnit $recipeUnit, DeleteRecipeUnit $service): JsonResponse
    {
        $this->authorize('delete', $recipeUnit);

        $service->delete($recipeUnit);

        return response()->json(null, 204);
    }
}
