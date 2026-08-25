<?php

namespace App\Models;

use App\Models\Concerns\HasStandardSearch;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Laravel\Scout\Searchable;

class Recipe extends Model
{
    use HasFactory, Searchable, HasStandardSearch;

    public const VALID_SORT_COLUMNS = ['title', 'created_at', 'time', 'difficulty'];

    protected $fillable = [
        'title',
        'description',
        'time',
        'portion',
        'difficulty',
        'category_id',
        'user_id',
        'company_id',
    ];

    public function shouldBeSearchable(): bool
    {
        return true;
    }

    public function toSearchableArray(): array
    {
        $this->load(['category', 'diets', 'user', 'ingredients']);

        return [
            'id' => (int) $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category_name' => $this->category->name ?? null,
            'author' => $this->user->name ?? null,
            'category_id' => $this->category_id,
            'user_id' => $this->user_id,
            'company_id' => $this->company_id,
            'diets' => $this->diets->pluck('id')->toArray(),
            'diet_names' => $this->diets->pluck('name')->toArray(),
            'ingredients' => $this->ingredients->pluck('name')->toArray(),
            'time' => (int) $this->time,
            'portion' => (int) $this->portion,
            'difficulty' => $this->difficulty,
            'created_at' => $this->created_at->timestamp,
            'updated_at' => $this->updated_at->timestamp,
        ];
    }

    public function searchableAs(): string
    {
        return 'recipes';
    }

    public function filterableAttributes(): array
    {
        return ['category_id', 'user_id', 'diets'];
    }

    public function sortableAttributes(): array
    {
        return ['created_at', 'title', 'time', 'difficulty'];
    }

    public function scopeFilter($query, array $filters)
    {
        $query = $this->scopeApplyStandardFilters($query, $filters);

        if (!empty($filters['diets'])) {
            $query->whereHas('diets', function ($query) use ($filters) {
                $query->whereIn('recipe_diets.id', $filters['diets']);
            });
        }

        return $query;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function diets(): BelongsToMany
    {
        return $this->belongsToMany(RecipeDiet::class, 'rl_recipe_diets', 'recipe_id', 'recipe_diet_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(RecipeCategory::class);
    }

    public function steps(): HasMany
    {
        return $this->hasMany(RecipeStep::class)->orderBy('order');
    }

    public function ingredients(): HasMany
    {
        return $this->hasMany(RecipeIngredient::class);
    }

    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    public function ratings(): MorphMany
    {
        return $this->morphMany(Rating::class, 'rateable');
    }

    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function favoritedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'rl_user_favorite_recipes', 'recipe_id', 'user_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
