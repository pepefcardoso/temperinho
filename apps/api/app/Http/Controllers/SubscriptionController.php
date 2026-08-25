<?php

namespace App\Http\Controllers;

use App\Http\Requests\Subscription\FilterSubscriptionRequest;
use App\Http\Requests\Subscription\StoreSubscriptionRequest;
use App\Http\Requests\Subscription\UpdateSubscriptionRequest;
use App\Http\Resources\Subscription\SubscriptionCollectionResource;
use App\Http\Resources\Subscription\SubscriptionResource;
use App\Models\Subscription;
use App\Services\Subscription\CreateSubscription;
use App\Services\Subscription\DeleteSubscription;
use App\Services\Subscription\ListSubscriptions;
use App\Services\Subscription\UpdateSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class SubscriptionController extends BaseResourceController
{
    public function __construct()
    {
        $this->authorizeResource(Subscription::class, 'subscription');
    }

    protected function getFilterRequestClass(): string
    {
        return FilterSubscriptionRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListSubscriptions::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return SubscriptionCollectionResource::class;
    }

    public function index(FilterSubscriptionRequest $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Subscription::class);
        return $this->standardIndex($request);
    }

    public function store(StoreSubscriptionRequest $request, CreateSubscription $service): JsonResponse
    {
        $subscription = $service->create($request->validated());

        return (new SubscriptionResource($subscription))
            ->response()
            ->setStatusCode(SymfonyResponse::HTTP_CREATED);
    }

    public function show(Subscription $subscription): SubscriptionResource
    {
        $this->authorize('view', $subscription);

        return new SubscriptionResource($subscription->load(['company', 'plan']));
    }

    public function update(UpdateSubscriptionRequest $request, Subscription $subscription, UpdateSubscription $service): SubscriptionResource
    {
        $subscription = $service->update($subscription, $request->validated());

        return new SubscriptionResource($subscription);
    }

    public function destroy(Subscription $subscription, DeleteSubscription $service): Response
    {
        $this->authorize('delete', $subscription);

        $service->delete($subscription);

        return response()->noContent();
    }
}
