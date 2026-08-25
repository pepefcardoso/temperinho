<?php

namespace App\Http\Controllers;

use App\Http\Requests\Post\FilterPostRequest;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Http\Resources\Post\PostCollectionResource;
use App\Http\Resources\Post\PostResource;
use App\Models\Post;
use App\Services\Post\CreatePost;
use App\Services\Post\DeletePost;
use App\Services\Post\ListFavoritePosts;
use App\Services\Post\ListPost;
use App\Services\Post\ListUserPosts;
use App\Services\Post\ShowPost;
use App\Services\Post\UpdatePost;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostController extends BaseResourceController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    protected function getFilterRequestClass(): string
    {
        return FilterPostRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListPost::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return PostCollectionResource::class;
    }

    public function index(FilterPostRequest $request): AnonymousResourceCollection
    {
        return $this->standardIndex($request);
    }

    public function store(StorePostRequest $request, CreatePost $service): PostResource
    {
        $post = $service->create($request->user(), $request->validated());
        $post->load(['user.image', 'category', 'topics', 'image']);
        return new PostResource($post);
    }

    public function show(Post $post, ShowPost $service): PostResource
    {
        $this->authorize('view', $post);
        $detailedPost = $service->show($post);
        return new PostResource($detailedPost);
    }

    public function update(UpdatePostRequest $request, Post $post, UpdatePost $service): PostResource
    {
        $updatedPost = $service->update($post, $request->validated());
        return new PostResource($updatedPost);
    }

    public function destroy(Post $post, DeletePost $service)
    {
        $this->authorize("delete", $post);

        $service->delete($post);

        return response()->json(null, 204);
    }

    public function userPosts(ListUserPosts $service): AnonymousResourceCollection
    {
        $this->authorize("viewAny", Post::class);

        $perPage = request()->input('per_page', 10);

        $userPosts = $service->list(request()->user()->id, $perPage);

        return PostCollectionResource::collection($userPosts);
    }

    public function favorites(ListFavoritePosts $service): AnonymousResourceCollection
    {
        $this->authorize("viewFavorites", Post::class);

        $perPage = request()->input('per_page', 10);

        $favorites = $service->list(request()->user()->id, $perPage);

        return PostCollectionResource::collection($favorites);
    }
}
