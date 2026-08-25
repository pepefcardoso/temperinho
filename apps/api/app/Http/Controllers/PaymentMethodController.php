<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentMethod\FilterPaymentMethodRequest;
use App\Http\Requests\PaymentMethod\StorePaymentMethodRequest;
use App\Http\Requests\PaymentMethod\UpdatePaymentMethodRequest;
use App\Http\Resources\PaymentMethod\PaymentMethodCollectionResource;
use App\Http\Resources\PaymentMethod\PaymentMethodResource;
use App\Models\PaymentMethod;
use App\Services\PaymentMethod\CreatePaymentMethod;
use App\Services\PaymentMethod\DeletePaymentMethod;
use App\Services\PaymentMethod\ListPaymentMethods;
use App\Services\PaymentMethod\UpdatePaymentMethod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PaymentMethodController extends BaseResourceController
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    protected function getFilterRequestClass(): string
    {
        return FilterPaymentMethodRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListPaymentMethods::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return PaymentMethodCollectionResource::class;
    }

    public function index(FilterPaymentMethodRequest $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', PaymentMethod::class);
        return $this->standardIndex($request);
    }

    public function store(StorePaymentMethodRequest $request, CreatePaymentMethod $service): JsonResponse
    {
        $paymentMethod = $service->create($request->validated());

        return (new PaymentMethodResource($paymentMethod))
            ->response()
            ->setStatusCode(201);
    }

    public function show(PaymentMethod $paymentMethod): PaymentMethodResource
    {
        $this->authorize('view', $paymentMethod);

        return new PaymentMethodResource($paymentMethod);
    }

    public function update(UpdatePaymentMethodRequest $request, PaymentMethod $paymentMethod, UpdatePaymentMethod $service): PaymentMethodResource
    {
        $paymentMethod = $service->update($paymentMethod, $request->validated());

        return new PaymentMethodResource($paymentMethod);
    }

    public function destroy(PaymentMethod $paymentMethod, DeletePaymentMethod $service): JsonResponse
    {
        $this->authorize('delete', $paymentMethod);

        $service->delete($paymentMethod);

        return response()->json(null, 204);
    }
}
