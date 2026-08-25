<?php

namespace App\Http\Resources\Post;

use App\Http\Resources\Image\ImageResource;
use App\Http\Resources\PostCategory\PostCategoryResource;
use App\Http\Resources\User\AuthorResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostCollectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'summary' => $this->summary,
            'image' => new ImageResource($this->whenLoaded('image')),
            'category' => new PostCategoryResource($this->whenLoaded('category')),
            'author' => new AuthorResource($this->whenLoaded('user')),
            'average_rating' => round($this->whenAggregated('ratings', 'rating', 'avg') ?? 0, 2),
            'ratings_count' => $this->whenCounted('ratings'),
            'is_favorited' => (bool) ($this->is_favorited ?? false),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
