<?php

namespace App\Http\Resources\Recipe;

use App\Http\Resources\Image\ImageResource;
use App\Http\Resources\RecipeCategory\RecipeCategoryResource;
use App\Http\Resources\RecipeDiet\RecipeDietResource;
use App\Http\Resources\RecipeIngredient\RecipeIngredientResource;
use App\Http\Resources\RecipeStep\RecipeStepResource;
use App\Http\Resources\User\AuthorResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecipeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $averageRating = $this->whenAggregated('ratings', 'rating', 'avg');

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'time' => $this->time,
            'portion' => $this->portion,
            'difficulty' => $this->difficulty,
            'image' => new ImageResource($this->whenLoaded('image')),
            'average_rating' => is_numeric($averageRating) ? round($averageRating, 2) : 0,
            'ratings_count' => $this->whenCounted('ratings'),
            'is_favorited' => (bool) ($this->is_favorited ?? false),
            'author' => new AuthorResource($this->whenLoaded('user')),
            'category' => new RecipeCategoryResource($this->whenLoaded('category')),
            'diets' => RecipeDietResource::collection($this->whenLoaded('diets')),
            'ingredients' => RecipeIngredientResource::collection($this->whenLoaded('ingredients')),
            'steps' => RecipeStepResource::collection($this->whenLoaded('steps')),
        ];
    }
}
