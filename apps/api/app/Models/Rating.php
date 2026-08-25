<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'rateable_id',
        'rateable_type',
        'rating',
    ];

    public function scopeFilter($query, array $filters)
    {
        if (isset($filters['rateable_type'])) {
            $query->where('rateable_type', $filters['rateable_type']);
        }
        if (isset($filters['rateable_id'])) {
            $query->where('rateable_id', $filters['rateable_id']);
        }
        return $query;
    }

    public function rateable()
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
