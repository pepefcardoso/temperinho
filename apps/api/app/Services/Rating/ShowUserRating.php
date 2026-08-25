<?php

namespace App\Services\Rating;

use App\Models\Rating;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ShowUserRating
{
    public function show(User $user, Model $rateable): ?Rating
    {
        return $rateable->ratings()->where('user_id', $user->id)->first();
    }
}
