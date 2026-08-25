<?php

namespace App\Services\Rating;

use App\Models\Rating;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class CreateRating
{
    use HandlesRatingCache;

    public function create(User $user, Model $rateable, array $data): Rating
    {
        $rating = $rateable->ratings()->updateOrCreate(
            ['user_id' => $user->id],
            ['rating' => $data['rating']]
        );

        $this->flushRateableCache($rateable);

        return $rating;
    }
}
