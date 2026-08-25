<?php

namespace App\Http\Controllers;

use App\Http\Requests\Payment\FilterPaymentRequest;
use App\Http\Requests\Payment\StorePaymentRequest;
use App\Http\Requests\Payment\UpdatePaymentRequest;
use App\Http\Resources\Payment\PaymentCollectionResource;
use App\Http\Resources\Payment\PaymentResource;
use App\Models\Payment;
use App\Services\Payment\CreatePayment;
use App\Services\Payment\DeletePayment;
use App\Services\Payment\ListPayments;
use App\Services\Payment\UpdatePayment;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class PaymentController extends BaseResourceController
{
    protected function getFilterRequestClass(): string
    {
        return FilterPaymentRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListPayments::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return PaymentCollectionResource::class;
    }

    public function index(FilterPaymentRequest $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Payment::class);
        return $this->standardIndex($request);
    }

    public function store(StorePaymentRequest $request, CreatePayment $service): PaymentResource
    {
        $payment = $service->create($request->validated());
        $payment->load('method');
        return new PaymentResource($payment);
    }

    public function show(Payment $payment): PaymentResource
    {
        $this->authorize('view', $payment);
        $payment->load(['subscription', 'method']);
        return new PaymentResource($payment);
    }

    public function update(UpdatePaymentRequest $request, Payment $payment, UpdatePayment $service): PaymentResource
    {
        $payment = $service->update($payment, $request->validated());
        $payment->load('method');
        return new PaymentResource($payment);
    }

    public function destroy(Payment $payment, DeletePayment $service): Response
    {
        $this->authorize('delete', $payment);
        $service->delete($payment);

        return response()->noContent();
    }
}
