<?php

namespace App\Http\Resources\Company;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyCollectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id' => $this->id, 'name' => $this->name, 'cnpj' => $this->cnpj, 'email' => $this->email, 'phone' => $this->phone, 'address' => $this->address, 'website' => $this->website, 'created_at' => $this->created_at->toDateTimeString()];
    }
}
