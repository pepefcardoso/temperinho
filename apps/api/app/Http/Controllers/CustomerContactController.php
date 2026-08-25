<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ManagesResourceCaching;
use App\Http\Requests\CustomerContact\StoreCustomerContactRequest;
use App\Http\Requests\CustomerContact\UpdateCustomerContactStatusRequest;
use App\Http\Resources\CustomerContact\CustomerContactCollectionResource;
use App\Http\Resources\CustomerContact\CustomerContactResource;
use App\Models\CustomerContact;
use App\Services\CustomerContact\CreateCustomerContact;
use App\Services\CustomerContact\UpdateCustomerContactStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

use App\Http\Requests\CustomerContact\FilterCustomerContactRequest;
use App\Services\CustomerContact\ListCustomerContacts;

class CustomerContactController extends BaseResourceController
{
    use ManagesResourceCaching;

    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['store']);
    }

    protected function getFilterRequestClass(): string
    {
        return FilterCustomerContactRequest::class;
    }

    protected function getListServiceClass(): string
    {
        return ListCustomerContacts::class;
    }

    protected function getCollectionResourceClass(): string
    {
        return CustomerContactCollectionResource::class;
    }

    protected function getCacheTag(): string
    {
        return 'customer_contacts';
    }

    public function index(FilterCustomerContactRequest $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', CustomerContact::class);
        return $this->standardIndex($request);
    }

    public function store(StoreCustomerContactRequest $request, CreateCustomerContact $service): JsonResponse
    {
        $contact = $service->create($request->validated());
        $this->flushResourceCache();

        return (new CustomerContactResource($contact))->response()->setStatusCode(201);
    }

    public function show(CustomerContact $customer_contact): CustomerContactResource
    {
        $this->authorize('view', $customer_contact);

        return new CustomerContactResource($customer_contact);
    }

    public function updateStatus(UpdateCustomerContactStatusRequest $request, CustomerContact $customerContact, UpdateCustomerContactStatus $service): CustomerContactResource
    {
        $updatedContact = $service->update($customerContact, $request->validated('status'));

        $this->flushResourceCache();

        return new CustomerContactResource($updatedContact);
    }
}
