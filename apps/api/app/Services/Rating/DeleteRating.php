<?php

namespace App\Services\Rating;

use App\Models\Rating;
use App\Models\User;

class DeleteRating
{
    use HandlesRatingCache;

    public function delete(User $user, Rating $rating): void
    {
        $rateable = $rating->rateable;
        $rating->delete();

        $this->flushRateableCache($rateable);
    }
}
