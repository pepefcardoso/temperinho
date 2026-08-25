<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecipeIngredient extends Model
{
    use HasFactory;

    protected $fillable = [
        'quantity',
        'name',
        'unit_id',
        'recipe_id'
    ];

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';
            $query->where('name', 'like', $searchTerm);
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

    public function unit(): BelongsTo
    {
        return $this->belongsTo(RecipeUnit::class);
    }
}
