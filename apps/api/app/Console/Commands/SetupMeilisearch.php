<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class SetupMeilisearch extends Command
{
    protected $signature = 'meilisearch:setup';
    protected $description = 'Setup Meilisearch indexes and settings';

    public function handle()
    {
        $host = config('scout.meilisearch.host');
        $key = config('scout.meilisearch.key');

        $this->info('Setting up Meilisearch...');

        // Import data
        $this->call('scout:import', ['model' => 'App\\Models\\Post']);
        $this->call('scout:import', ['model' => 'App\\Models\\Recipe']);

        $this->configureIndex($host, $key, 'posts', [
            'filterable' => ['category_id', 'user_id', 'company_id'],
            'sortable' => ['title', 'created_at']
        ]);

        $this->configureIndex($host, $key, 'recipes', [
            'filterable' => ['category_id', 'user_id', 'company_id', 'diets', 'difficulty', 'time'],
            'sortable' => ['created_at', 'title', 'time', 'difficulty']
        ]);

        $this->info('Meilisearch setup completed!');
    }

    private function configureIndex(string $host, string $key, string $index, array $settings)
    {
        $headers = ['Authorization' => "Bearer {$key}"];

        Http::withHeaders($headers)->post(
            "{$host}/indexes/{$index}/settings/filterable-attributes",
            $settings['filterable']
        );

        Http::withHeaders($headers)->post(
            "{$host}/indexes/{$index}/settings/sortable-attributes",
            $settings['sortable']
        );

        $this->info("Configured {$index} index");
    }
}
