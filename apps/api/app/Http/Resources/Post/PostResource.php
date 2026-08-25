<?php

namespace App\Http\Resources\Post;

use App\Http\Resources\Image\ImageResource;
use App\Http\Resources\PostCategory\PostCategoryResource;
use App\Http\Resources\PostTopic\PostTopicResource;
use App\Http\Resources\User\AuthorResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $averageRating = isset($this->average_rating) ? round($this->average_rating, 2) : 0;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'summary' => $this->summary,
            'content' => $this->content,
            'image' => new ImageResource($this->whenLoaded('image')),
            'average_rating' => $averageRating,
            'ratings_count' => $this->whenCounted('ratings'),
            'is_favorited' => (bool) ($this->is_favorited ?? false),
            'author' => new AuthorResource($this->whenLoaded('user')),
            'category' => new PostCategoryResource($this->whenLoaded('category')),
            'topics' => PostTopicResource::collection($this->whenLoaded('topics')),
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
