<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use MeiliSearch\Client;
use App\Models\Post;
use App\Models\Recipe;

class ResetMeilisearchIndexes extends Command
{
    protected $signature = 'meilisearch:reset';
    protected $description = 'Reset and reconfigure Meilisearch indexes';

    public function handle()
    {
        $client = new Client(config('scout.meilisearch.host'), config('scout.meilisearch.key'));

        $this->info('Resetting Meilisearch indexes...');

        $this->resetIndex($client, 'posts');
        $this->setupPostsIndex($client);

        $this->resetIndex($client, 'recipes');
        $this->setupRecipesIndex($client);

        $this->info('Re-indexing data...');

        $this->call('scout:import', ['model' => Post::class]);
        $this->call('scout:import', ['model' => Recipe::class]);

        $this->info('Meilisearch reset completed!');
    }

    private function resetIndex(Client $client, string $indexName)
    {
        try {
            $client->deleteIndex($indexName);
            $this->info("Deleted index: {$indexName}");
        } catch (\Exception $e) {
            $this->warn("Index {$indexName} doesn't exist or couldn't be deleted");
        }
        sleep(1);
    }

    /**
     * Configura o índice 'posts'
     */
    private function setupPostsIndex(Client $client)
    {
        $indexName = 'posts';

        // **CORREÇÃO APLICADA AQUI**
        // 1. Inicia a tarefa de criação do índice.
        $client->createIndex($indexName, ['primaryKey' => 'id']);

        // 2. Obtém o objeto do índice para poder configurá-lo.
        $index = $client->index($indexName);

        // A pausa é útil para dar tempo ao Meilisearch de processar a criação.
        sleep(2);

        // Agora a variável $index é um objeto e os métodos funcionarão corretamente.
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

        $client->createIndex($indexName, ['primaryKey' => 'id']);

        $index = $client->index($indexName);

        sleep(2);

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
