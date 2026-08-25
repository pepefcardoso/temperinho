<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ManagesResourceCaching;
use App\Http\Requests\Plan\StorePlanRequest;
use App\Http\Requests\Plan\UpdatePlanRequest;
use App\Http\Resources\Plan\PlanCollectionResource;
use App\Http\Resources\Plan\PlanResource;
use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

use App\Http\Requests\Plan\FilterPlanRequest;
use App\Services\Plan\ListPlans;

class PlanController extends BaseResourceController
{
    use ManagesResourceCaching;

    public function __construct()
    {
        $this->authorizeResource(Plan::class, 'plan');
    }

    protected function getFilterRequestClass(): string
    {
        return FilterPlanRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListPlans::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return PlanCollectionResource::class;
    }

    protected function getCacheTag(): string
    {
        return 'plans';
    }

    public function index(FilterPlanRequest $request): JsonResource
    {
        $this->authorize('viewAny', Plan::class);
        return $this->standardIndex($request);
    }

    public function store(StorePlanRequest $request): JsonResponse
    {
        $plan = Plan::create($request->validated());
        $this->flushResourceCache();

        return response()->json(new PlanResource($plan), SymfonyResponse::HTTP_CREATED);
    }

    public function show(Plan $plan): PlanResource
    {
        return new PlanResource($plan);
    }

    public function update(UpdatePlanRequest $request, Plan $plan): PlanResource
    {
        $plan->update($request->validated());
        $this->flushResourceCache();

        return new PlanResource($plan);
    }

    public function destroy(Plan $plan): Response
    {
        $this->authorize("delete", $plan);

        $plan->delete();
        $this->flushResourceCache();

        return response()->noContent();
    }
}
