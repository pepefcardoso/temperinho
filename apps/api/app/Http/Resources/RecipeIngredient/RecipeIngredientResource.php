<?php

namespace App\Http\Resources\RecipeIngredient;

use App\Http\Resources\RecipeUnit\RecipeUnitResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeIngredientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'quantity' => $this->quantity,
            'unit' => new RecipeUnitResource($this->whenLoaded('unit')),
        ];
    }
}
