<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecipeStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'order',
        'description',
        'recipe_id'
    ];

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';
            $query->where('description', 'like', $searchTerm);
        }

        if (isset($filters['recipe_id'])) {
            $query->where('recipe_id', $filters['recipe_id']);
        }

        return $query;
    }

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }
}
