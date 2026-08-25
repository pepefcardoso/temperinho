<?php

namespace App\Http\Controllers;

use App\Http\Requests\Comment\StoreCommentRequest;
use App\Http\Requests\Comment\UpdateCommentRequest;
use App\Http\Resources\Comment\CommentCollectionResource;
use App\Http\Resources\Comment\CommentResource;
use App\Models\Comment;
use App\Services\Comment\CreateComment;
use App\Services\Comment\DeleteComment;
use App\Services\Comment\ListComments;
use App\Services\Comment\UpdateComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

use App\Http\Requests\Comment\FilterCommentRequest;

class CommentController extends BaseResourceController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    protected function getFilterRequestClass(): string
    {
        return FilterCommentRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListComments::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return CommentCollectionResource::class;
    }

    public function index(FilterCommentRequest $request, string $type, $commentableId): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Comment::class);
        return $this->standardIndex($request);
    }

    public function store(StoreCommentRequest $request, string $type, int $commentableId, CreateComment $service): JsonResponse
    {
        $commentable = $this->resolveCommentable($type, $commentableId);
        
        $comment = $service->execute($commentable, $request->user(), $request->validated());

        return (new CommentResource($comment->load('user.image')))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateCommentRequest $request, Comment $comment, UpdateComment $service): CommentResource
    {
        $comment = $service->execute($comment, $request->user(), $request->validated());

        return new CommentResource($comment->load('user.image'));
    }

    public function destroy(Request $request, Comment $comment, DeleteComment $service): JsonResponse
    {
        $this->authorize('delete', $comment);

        $service->execute($comment, $request->user());

        return response()->json(null, 204);
    }

    public function show(Comment $comment): CommentResource
    {
        $this->authorize('view', $comment);

        return new CommentResource($comment->load('user.image'));
    }

    protected function resolveCommentable(string $type, $id)
    {
        $class = 'App\\Models\\' . Str::studly(Str::singular($type));
        abort_unless(class_exists($class), 404, "Tipo inválido: {$type}");
        return $class::findOrFail($id);
    }
}
