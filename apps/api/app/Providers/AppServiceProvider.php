<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\ServiceProvider;
use App\Models\Post;
use App\Models\Recipe;
use Illuminate\Support\Facades\Route;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Route::bind('commentable', function (string $value, $route) {
            $type = $route->parameter('type');

            $modelClass = match ($type) {
                'posts' => Post::class,
                'recipes' => Recipe::class,
                default => throw new ModelNotFoundException("Unsupported type: $type"),
            };

            return $modelClass::findOrFail($value);
        });

        Route::bind('rateable', function (string $value, $route) {
            $type = $route->parameter('type');

            $modelClass = match ($type) {
                'posts' => Post::class,
                'recipes' => Recipe::class,
                default => throw new ModelNotFoundException("Unsupported type: $type"),
            };

            return $modelClass::findOrFail($value);
        });

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}
