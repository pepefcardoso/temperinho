<?php

namespace App\Http\Controllers;

use App\Http\Requests\Rating\StoreRatingRequest;
use App\Http\Requests\Rating\UpdateRatingRequest;
use App\Http\Resources\Rating\RatingCollectionResource;
use App\Http\Resources\Rating\RatingResource;
use App\Models\Rating;
use App\Services\Rating\CreateRating;
use App\Services\Rating\DeleteRating;
use App\Services\Rating\ListRatings;
use App\Services\Rating\ShowUserRating;
use App\Services\Rating\UpdateRating;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

use App\Http\Requests\Rating\FilterRatingRequest;

class RatingController extends BaseResourceController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show', 'showUserRating']);
    }

    protected function getFilterRequestClass(): string
    {
        return FilterRatingRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListRatings::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return RatingCollectionResource::class;
    }

    public function index(FilterRatingRequest $request, string $type, int $rateableId): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Rating::class);
        return $this->standardIndex($request);
    }

    public function store(StoreRatingRequest $request, CreateRating $service, string $type, int $rateableId): JsonResponse
    {
        $rateable = $this->resolveRateable($type, $rateableId);

        $rating = $service->create($request->user(), $rateable, $request->validated());

        $statusCode = $rating->wasRecentlyCreated ? 201 : 200;
        return (new RatingResource($rating))->response()->setStatusCode($statusCode);
    }

    public function update(UpdateRatingRequest $request, UpdateRating $service, Rating $rating): RatingResource
    {
        $updatedRating = $service->update($request->user(), $rating, $request->validated());

        return new RatingResource($updatedRating);
    }

    public function destroy(Request $request, DeleteRating $service, Rating $rating): JsonResponse
    {
        $this->authorize('delete', $rating);

        $service->delete($request->user(), $rating);

        return response()->json(null, 204);
    }

    public function showUserRating(Request $request, ShowUserRating $service, string $type, int $rateableId)
    {
        $this->authorize('view', Rating::class);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Nenhuma avaliação encontrada para este usuário.'], 404);
        }

        $rateable = $this->resolveRateable($type, $rateableId);
        $rating = $service->show($user, $rateable);

        if (!$rating) {
            return response()->json(['message' => 'Nenhuma avaliação encontrada para este usuário.'], 404);
        }
        return new RatingResource($rating);
    }

    public function show(Rating $rating): RatingResource
    {
        $this->authorize('view', $rating);

        return new RatingResource($rating->load('user'));
    }

    protected function resolveRateable(string $type, $id)
    {
        $class = 'App\\Models\\' . Str::studly(Str::singular($type));
        abort_unless(class_exists($class), 404, "Tipo inválido: {$type}");
        return $class::findOrFail($id);
    }
}
