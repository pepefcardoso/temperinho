<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecipeCategory\FilterRecipeCategoryRequest;
use App\Http\Requests\RecipeCategory\StoreRecipeCategoryRequest;
use App\Http\Requests\RecipeCategory\UpdateRecipeCategoryRequest;
use App\Http\Resources\RecipeCategory\RecipeCategoryCollectionResource;
use App\Http\Resources\RecipeCategory\RecipeCategoryResource;
use App\Models\RecipeCategory;
use App\Services\RecipeCategory\CreateRecipeCategory;
use App\Services\RecipeCategory\DeleteRecipeCategory;
use App\Services\RecipeCategory\ListRecipeCategories;
use App\Services\RecipeCategory\UpdateRecipeCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RecipeCategoryController extends BaseResourceController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    protected function getFilterRequestClass(): string
    {
        return FilterRecipeCategoryRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListRecipeCategories::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return RecipeCategoryCollectionResource::class;
    }

    public function index(FilterRecipeCategoryRequest $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', RecipeCategory::class);

        return $this->standardIndex($request);
    }

    public function store(StoreRecipeCategoryRequest $request, CreateRecipeCategory $service): JsonResponse
    {
        $category = $service->create($request->validated());

        return (new RecipeCategoryResource($category))
            ->response()
            ->setStatusCode(201);
    }

    public function show(RecipeCategory $recipeCategory): RecipeCategoryResource
    {
        $this->authorize('view', $recipeCategory);

        return new RecipeCategoryResource($recipeCategory);
    }

    public function update(UpdateRecipeCategoryRequest $request, RecipeCategory $recipeCategory, UpdateRecipeCategory $service): RecipeCategoryResource
    {
        $updatedCategory = $service->update($recipeCategory, $request->validated());

        return new RecipeCategoryResource($updatedCategory);
    }

    public function destroy(RecipeCategory $recipeCategory, DeleteRecipeCategory $service): JsonResponse
    {
        $this->authorize('delete', $recipeCategory);

        $service->delete($recipeCategory);

        return response()->json(null, 204);
    }
}
