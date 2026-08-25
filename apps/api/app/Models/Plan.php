<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    /** @use HasFactory<\Database\Factories\PlanFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'badge',
        'price',
        'period',
        'description',
        'features',
        'status',
        'display_order',
        'max_users',
        'max_posts',
        'max_recipes',
        'max_banners',
        'max_email_campaigns',
        'newsletter',
        'trial_days',
        'is_popular',
    ];

    protected $casts = [
        'features' => 'array',
        'newsletter' => 'boolean',
        'is_popular' => 'boolean',
        'trial_days' => 'integer',
        'max_users' => 'integer',
        'max_posts' => 'integer',
        'max_recipes' => 'integer',
        'max_banners' => 'integer',
        'max_email_campaigns' => 'integer',
        'display_order' => 'integer',
    ];

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';

            $query->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', $searchTerm)
                    ->orWhere('description', 'like', $searchTerm)
                    ->orWhere('id', 'like', $searchTerm);
            });
        }

        return $query;
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }
}
