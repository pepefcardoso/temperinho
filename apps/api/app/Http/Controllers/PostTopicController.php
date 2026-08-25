<?php

namespace App\Http\Controllers;

use App\Http\Requests\PostTopic\FilterPostTopicRequest;
use App\Http\Requests\PostTopic\StorePostTopicRequest;
use App\Http\Requests\PostTopic\UpdatePostTopicRequest;
use App\Http\Resources\PostTopic\PostTopicCollectionResource;
use App\Http\Resources\PostTopic\PostTopicResource;
use App\Models\PostTopic;
use App\Services\PostTopic\CreatePostTopic;
use App\Services\PostTopic\DeletePostTopic;
use App\Services\PostTopic\ListPostTopics;
use App\Services\PostTopic\UpdatePostTopic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PostTopicController extends BaseResourceController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    protected function getFilterRequestClass(): string
    {
        return FilterPostTopicRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListPostTopics::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return PostTopicCollectionResource::class;
    }

    public function index(FilterPostTopicRequest $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', PostTopic::class);

        return $this->standardIndex($request);
    }

    public function store(StorePostTopicRequest $request, CreatePostTopic $service): JsonResponse
    {
        $topic = $service->create($request->validated());

        return (new PostTopicResource($topic))->response()->setStatusCode(201);
    }

    public function show(PostTopic $postTopic): PostTopicResource
    {
        $this->authorize('view', $postTopic);

        return new PostTopicResource($postTopic);
    }

    public function update(UpdatePostTopicRequest $request, PostTopic $postTopic, UpdatePostTopic $service): PostTopicResource
    {
        $updatedTopic = $service->update($postTopic, $request->validated());

        return new PostTopicResource($updatedTopic);
    }

    public function destroy(PostTopic $postTopic, DeletePostTopic $service): JsonResponse
    {
        $this->authorize('delete', $postTopic);

        $service->delete($postTopic);

        return response()->json(null, 204);
    }
}
