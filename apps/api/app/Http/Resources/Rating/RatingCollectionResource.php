<?php

namespace App\Http\Resources\Rating;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RatingCollectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id' => $this->id, 'rating' => $this->rating, 'author' => new \App\Http\Resources\User\AuthorResource($this->whenLoaded('user')), 'created_at' => $this->created_at->toDateTimeString()];
    }
}
