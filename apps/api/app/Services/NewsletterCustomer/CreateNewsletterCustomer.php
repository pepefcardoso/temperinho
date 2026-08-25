<?php

namespace App\Services\NewsletterCustomer;

use App\Models\NewsletterCustomer;
use App\Notifications\CreateNewsletterCustomerNotification;
use Illuminate\Support\Facades\Notification;

class CreateNewsletterCustomer
{
    /**
     * Inscreve um novo cliente na newsletter e envia uma notificação de boas-vindas.
     * A transação foi removida por envolver apenas uma operação de escrita.
     *
     * @param array $data Os dados validados para a inscrição.
     * @return NewsletterCustomer
     */
    public function create(array $data): NewsletterCustomer
    {
        $newsletterCustomer = NewsletterCustomer::create($data);

        Notification::route('mail', $newsletterCustomer->email)
            ->notify(new CreateNewsletterCustomerNotification($newsletterCustomer));

        return $newsletterCustomer;
    }
}
