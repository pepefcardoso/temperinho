<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'commentable_id',
        'commentable_type',
        'content',
    ];

    public function scopeFilter($query, array $filters)
    {
        if (isset($filters['commentable_type'])) {
            $query->where('commentable_type', $filters['commentable_type']);
        }
        if (isset($filters['commentable_id'])) {
            $query->where('commentable_id', $filters['commentable_id']);
        }
        return $query;
    }

    public function commentable()
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
