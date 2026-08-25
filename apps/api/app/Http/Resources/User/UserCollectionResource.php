<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserCollectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $auth = $request->user();
        
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->when($auth && $auth->can('view', $this->resource), $this->email),
            'role' => $this->role?->name
        ];
    }
}
