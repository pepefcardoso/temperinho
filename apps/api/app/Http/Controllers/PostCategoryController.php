<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostCategory\FilterPostCategoryRequest;
use App\Http\Requests\PostCategory\StorePostCategoryRequest;
use App\Http\Requests\PostCategory\UpdatePostCategoryRequest;
use App\Http\Resources\PostCategory\PostCategoryCollectionResource;
use App\Http\Resources\PostCategory\PostCategoryResource;
use App\Models\PostCategory;
use App\Services\PostCategory\CreatePostCategory;
use App\Services\PostCategory\DeletePostCategory;
use App\Services\PostCategory\ListPostCategories;
use App\Services\PostCategory\UpdatePostCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostCategoryController extends BaseResourceController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    protected function getFilterRequestClass(): string
    {
        return FilterPostCategoryRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListPostCategories::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return PostCategoryCollectionResource::class;
    }

    public function index(FilterPostCategoryRequest $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', PostCategory::class);

        return $this->standardIndex($request);
    }

    public function store(StorePostCategoryRequest $request, CreatePostCategory $service): JsonResponse
    {
        $category = $service->create($request->validated());

        return (new PostCategoryResource($category))->response()->setStatusCode(201);
    }

    public function show(PostCategory $postCategory): PostCategoryResource
    {
        $this->authorize('view', $postCategory);

        return new PostCategoryResource($postCategory);
    }

    public function update(UpdatePostCategoryRequest $request, PostCategory $postCategory, UpdatePostCategory $service): PostCategoryResource
    {
        $updatedCategory = $service->update($postCategory, $request->validated());

        return new PostCategoryResource($updatedCategory);
    }

    public function destroy(PostCategory $postCategory, DeletePostCategory $service): JsonResponse
    {
        $this->authorize('delete', $postCategory);

        $service->delete($postCategory);

        return response()->json(null, 204);
    }
}
