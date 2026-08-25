<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ManagesResourceCaching;
use App\Http\Requests\NewsletterCustomer\StoreNewsletterCustomerRequest;
use App\Http\Resources\NewsletterCustomer\NewsletterCustomerCollectionResource;
use App\Http\Resources\NewsletterCustomer\NewsletterCustomerResource;
use App\Models\NewsletterCustomer;
use App\Services\NewsletterCustomer\CreateNewsletterCustomer;
use App\Services\NewsletterCustomer\DeleteNewsletterCustomer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

use App\Http\Requests\NewsletterCustomer\FilterNewsletterCustomerRequest;
use App\Services\NewsletterCustomer\ListNewsletterCustomers;

class NewsletterCustomerController extends BaseResourceController
{
    use ManagesResourceCaching;

    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['store']);
    }

    protected function getFilterRequestClass(): string
    {
        return FilterNewsletterCustomerRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListNewsletterCustomers::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return NewsletterCustomerCollectionResource::class;
    }

    protected function getCacheTag(): string
    {
        return 'newsletter_customers';
    }

    public function index(FilterNewsletterCustomerRequest $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', NewsletterCustomer::class);
        return $this->standardIndex($request);
    }

    public function store(StoreNewsletterCustomerRequest $request, CreateNewsletterCustomer $service): JsonResponse
    {
        $customer = $service->create($request->validated());
        $this->flushResourceCache();

        return (new NewsletterCustomerResource($customer))->response()->setStatusCode(201);
    }

    public function show(NewsletterCustomer $newsletter): NewsletterCustomerResource
    {
        $this->authorize('view', $newsletter);

        return new NewsletterCustomerResource($newsletter);
    }

    public function destroy(NewsletterCustomer $newsletter, DeleteNewsletterCustomer $service): JsonResponse
    {
        $this->authorize('delete', $newsletter);
        $service->delete($newsletter);
        $this->flushResourceCache();

        return response()->json(null, 204);
    }
}
