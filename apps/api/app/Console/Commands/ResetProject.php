<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ResetProject extends Command
{
    protected $signature = 'config:reset-project';

    protected $description = 'Clear all Laravel caches (config, routes, views, and application cache).';

    public function handle()
    {
        $this->info('Clearing config cache...');
        $this->call('config:clear');

        $this->info('Clearing route cache...');
        $this->call('route:clear');

        $this->info('Clearing application cache...');
        $this->call('cache:clear');

        $this->info('Clearing view cache...');
        $this->call('view:clear');

        $this->info('Rebuilding config cache...');
        $this->call('config:cache');

        $this->info('Rebuilding route cache...');
        $this->call('route:cache');

        $this->info('Migrating and resetting tables...');
        $this->call('migrate:fresh', ['--seed' => true]);

        $this->info('Optimizing the application...');
        $this->call('optimize');

        $this->call('storage:link');
        $this->info('Storage link created successfully.');

        $this->call('key:generate');
        $this->info('Application key generated successfully.');
    }
}
