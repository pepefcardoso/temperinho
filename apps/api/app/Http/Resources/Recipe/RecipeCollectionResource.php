<?php

namespace App\Http\Resources\Recipe;

use App\Http\Resources\Image\ImageResource;
use App\Http\Resources\RecipeCategory\RecipeCategoryResource;
use App\Http\Resources\RecipeDiet\RecipeDietResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeCollectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'time' => $this->time,
            'portion' => $this->portion,
            'difficulty' => $this->difficulty,
            'image' => new ImageResource($this->whenLoaded('image')),
            'category' => new RecipeCategoryResource($this->whenLoaded('category')),
            'diets' => RecipeDietResource::collection($this->whenLoaded('diets')),
            'average_rating' => round($this->whenAggregated('ratings', 'rating', 'avg') ?? 0, 2),
            'ratings_count' => $this->whenCounted('ratings'),
            'is_favorited' => (bool) ($this->is_favorited ?? false),
        ];
    }
}
