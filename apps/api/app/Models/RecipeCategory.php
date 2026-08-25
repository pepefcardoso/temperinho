<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RecipeCategory extends Model
{
    /** @use HasFactory<RecipeCategoryFactory> */
    use HasFactory;

    protected $fillable = ['name', 'normalized_name'];

    public const VALID_SORT_COLUMNS = ['id', 'name', 'normalized_name', 'created_at', 'updated_at'];

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('normalized_name', 'like', "%{$filters['search']}%");
        }
    }

    public function recipes(): HasMany
    {
        return $this->hasMany(Recipe::class, 'category_id');
    }
}
