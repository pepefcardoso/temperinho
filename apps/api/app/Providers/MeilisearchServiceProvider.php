<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Scout\Events\ModelsImported;
use Illuminate\Support\Facades\Event;
use MeiliSearch\Client;
use App\Models\Post;
use App\Models\Recipe;

class MeilisearchServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        if (config('scout.driver') === 'meilisearch') {
            Event::listen(ModelsImported::class, function ($event) {
                $this->configureIndex($event->models->first());
            });
        }
    }

    private function configureIndex($model)
    {
        if (!$model)
            return;

        $client = new Client(config('scout.meilisearch.host'), config('scout.meilisearch.key'));

        try {
            if ($model instanceof Post) {
                $this->configurePostsIndex($client);
            } elseif ($model instanceof Recipe) {
                $this->configureRecipesIndex($client);
            }
        } catch (\Exception $e) {
            logger()->error("Error configuring Meilisearch index: " . $e->getMessage());
        }
    }

    private function configurePostsIndex(Client $client)
    {
        $index = $client->getIndex('posts');

        $index->updateFilterableAttributes([
            'category_id',
            'user_id',
            'company_id'
        ]);

        $index->updateSortableAttributes([
            'created_at',
            'updated_at',
            'title'
        ]);

        $index->updateSearchableAttributes([
            'title',
            'summary',
            'content',
            'author',
            'topics',
            'category_name'
        ]);
    }

    private function configureRecipesIndex(Client $client)
    {
        $index = $client->getIndex('recipes');

        $index->updateFilterableAttributes([
            'category_id',
            'user_id',
            'company_id',
            'diets',
            'difficulty',
            'time'
        ]);

        $index->updateSortableAttributes([
            'created_at',
            'updated_at',
            'title',
            'time',
            'difficulty'
        ]);

        $index->updateSearchableAttributes([
            'title',
            'description',
            'category_name',
            'author',
            'diet_names',
            'ingredients'
        ]);
    }
}
