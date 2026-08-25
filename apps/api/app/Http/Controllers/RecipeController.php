<?php

namespace App\Http\Controllers;

use App\Http\Requests\Recipe\FilterRecipeRequest;
use App\Http\Requests\Recipe\StoreRecipeRequest;
use App\Http\Requests\Recipe\UpdateRecipeRequest;
use App\Http\Resources\Recipe\RecipeCollectionResource;
use App\Http\Resources\Recipe\RecipeResource;
use App\Models\Recipe;
use App\Services\Recipe\CreateRecipe;
use App\Services\Recipe\DeleteRecipe;
use App\Services\Recipe\ListFavoriteRecipes;
use App\Services\Recipe\ListRecipe;
use App\Services\Recipe\ListUserRecipes;
use App\Services\Recipe\ShowRecipe;
use App\Services\Recipe\UpdateRecipe;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RecipeController extends BaseResourceController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    protected function getFilterRequestClass(): string
    {
        return FilterRecipeRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListRecipe::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return RecipeCollectionResource::class;
    }

    public function index(FilterRecipeRequest $request): AnonymousResourceCollection
    {
        return $this->standardIndex($request);
    }

    public function store(StoreRecipeRequest $request, CreateRecipe $service): RecipeResource
    {
        $recipe = $service->create($request->user(), $request->validated());

        $recipe->load(['user.image', 'category', 'diets', 'ingredients.unit', 'steps', 'image']);

        return new RecipeResource($recipe);
    }

    public function show(Recipe $recipe, ShowRecipe $service): RecipeResource
    {
        $this->authorize('view', $recipe);

        $detailedRecipe = $service->show($recipe);
        return new RecipeResource($detailedRecipe);
    }

    public function update(UpdateRecipeRequest $request, Recipe $recipe, UpdateRecipe $service): RecipeResource
    {
        $updatedRecipe = $service->update($recipe, $request->validated());

        return new RecipeResource($updatedRecipe);
    }

    public function destroy(Recipe $recipe, DeleteRecipe $service)
    {
        $this->authorize("delete", $recipe);

        $service->delete($recipe);

        return response()->json(null, 204);
    }

    public function userRecipes(ListUserRecipes $service): AnonymousResourceCollection
    {
        $this->authorize("viewAny", Recipe::class);

        $perPage = request()->input('per_page', 10);

        $userRecipes = $service->list(request()->user()->id, $perPage);

        return RecipeCollectionResource::collection($userRecipes);
    }

    public function favorites(ListFavoriteRecipes $service): AnonymousResourceCollection
    {
        $this->authorize("viewFavorites", Recipe::class);

        $perPage = request()->input('per_page', 10);

        $favorites = $service->list(request()->user()->id, $perPage);

        return RecipeCollectionResource::collection($favorites);
    }
}
