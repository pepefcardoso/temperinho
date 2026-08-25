<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use App\Notifications\PlanSubscriptionExpired;

class ExpireSubscriptions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:expire-subscriptions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica e atualiza o status de subscrições expiradas para "expired"';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('A verificar subscrições expiradas...');

        $expiredSubscriptions = Subscription::where('status', 'active')
            ->where('ends_at', '<=', Carbon::now())
            ->get();

        if ($expiredSubscriptions->isEmpty()) {
            $this->info('Nenhuma subscrição expirada encontrada.');
            return;
        }

        $count = $expiredSubscriptions->count();
        $this->info($count . ' subscrição(ões) expirada(s) encontrada(s). A atualizar...');

        $this->withProgressBar($expiredSubscriptions, function ($subscription) {
            $subscription->status = 'expired';
            $subscription->save();
            $subscription->company->notify(new PlanSubscriptionExpired($subscription));
        });

        $this->newLine(2);
        $this->info('Processo concluído com sucesso!');
    }
}
