<?php

namespace App\Models;

use App\Enum\RolesEnum;
use App\Notifications\PasswordResetNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @mixin \Laravel\Sanctum\HasApiTokens
 */
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name', 'email', 'birthday', 'phone', 'password', 'role', 'provider', 'provider_id',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'role' => RolesEnum::class,
    ];

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new PasswordResetNotification($this->name, $token));
    }

    public function scopeFilter($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';

            $query->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', $searchTerm)
                    ->orWhere('email', 'like', $searchTerm)
                    ->orWhere('phone', 'like', $searchTerm)
                    ->orWhere('id', 'like', $searchTerm);
            });
        }

        if (!empty($filters['role']) && is_array($filters['role'])) {
            $query->whereIn('role', $filters['role']);
        }

        if (!empty($filters['birthday_start']) && !empty($filters['birthday_end'])) {
            $query->whereBetween('birthday', [$filters['birthday_start'], $filters['birthday_end']]);
        }

        return $query;
    }

    public function isInternal(): bool
    {
        return $this->role->value <= RolesEnum::INTERNAL->value;
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function recipes(): HasMany
    {
        return $this->hasMany(Recipe::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(Image::class);
    }

    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    public function favoritePosts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class, 'rl_user_favorite_posts', 'user_id', 'post_id');
    }

    public function favoriteRecipes(): BelongsToMany
    {
        return $this->belongsToMany(Recipe::class, 'rl_user_favorite_recipes', 'user_id', 'recipe_id');
    }

    public function company(): HasOne
    {
        return $this->hasOne(Company::class);
    }
}
