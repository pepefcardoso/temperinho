<?php

namespace App\Services\Rating;

use App\Models\Rating;
use App\Models\User;

class UpdateRating
{
    use HandlesRatingCache;

    public function update(User $user, Rating $rating, array $data): Rating
    {
        $rating->update($data);

        $this->flushRateableCache($rating->rateable);

        return $rating;
    }
}
