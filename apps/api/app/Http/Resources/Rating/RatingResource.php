<?php

namespace App\Http\Resources\Rating;

use App\Http\Resources\User\AuthorResource;
use Illuminate\Http\Resources\Json\JsonResource;

class RatingResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'author' => new AuthorResource($this->whenLoaded('user')),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
