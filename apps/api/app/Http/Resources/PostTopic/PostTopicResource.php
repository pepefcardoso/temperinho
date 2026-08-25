<?php

namespace App\Http\Resources\PostTopic;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostTopicResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id' => $this->id, 'name' => $this->name];
    }
}
