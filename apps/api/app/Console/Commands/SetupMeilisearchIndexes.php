<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use MeiliSearch\Client;
class SetupMeilisearchIndexes extends Command
{
    protected $signature = 'meilisearch:setup-indexes';
    protected $description = 'Setup Meilisearch indexes with proper settings';

    public function handle()
    {
        $client = new Client(config('scout.meilisearch.host'), config('scout.meilisearch.key'));

        $this->info('Setting up Meilisearch indexes...');

        $this->setupPostsIndex($client);

        $this->setupRecipesIndex($client);

        $this->info('Meilisearch indexes setup completed!');
    }

    private function setupPostsIndex(Client $client)
    {
        $indexName = 'posts';

        try {
            $index = $client->getIndex($indexName);
        } catch (\Exception $e) {
            $this->info("Creating index: {$indexName}");
            $index = $client->createIndex($indexName, ['primaryKey' => 'id']);
        }

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

        $this->info("Posts index configured successfully");
    }

    private function setupRecipesIndex(Client $client)
    {
        $indexName = 'recipes';

        try {
            $index = $client->getIndex($indexName);
        } catch (\Exception $e) {
            $this->info("Creating index: {$indexName}");
            $index = $client->createIndex($indexName, ['primaryKey' => 'id']);
        }

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

        $this->info("Recipes index configured successfully");
    }
}
