<?php

namespace App\Http\Resources\Comment;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentCollectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id' => $this->id, 'content' => $this->content, 'author' => new \App\Http\Resources\User\AuthorResource($this->whenLoaded('user')), 'created_at' => $this->created_at->toDateTimeString()];
    }
}
