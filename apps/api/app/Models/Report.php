<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_REVIEWED = 'reviewed';

    public const REASONS = ['spam', 'inappropriate', 'misinformation', 'other'];

    public const VALID_SORT_COLUMNS = ['created_at', 'status'];

    protected $fillable = [
        'user_id',
        'reportable_id',
        'reportable_type',
        'reason',
        'comment',
        'status',
    ];

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        return $query;
    }

    public function reportable()
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
