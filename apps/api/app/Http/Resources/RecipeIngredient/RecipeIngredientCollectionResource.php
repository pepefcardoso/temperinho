<?php

namespace App\Http\Resources\RecipeIngredient;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeIngredientCollectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id' => $this->id, 'name' => $this->name, 'quantity' => $this->quantity, 'unit' => new \App\Http\Resources\RecipeUnit\RecipeUnitResource($this->whenLoaded('unit'))];
    }
}
