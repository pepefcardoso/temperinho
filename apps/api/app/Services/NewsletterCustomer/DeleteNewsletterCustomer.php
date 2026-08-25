<?php

namespace App\Services\NewsletterCustomer;

use App\Models\NewsletterCustomer;
use App\Notifications\DeleteNewsletterCustomerNotification;
use Illuminate\Support\Facades\Notification;

class DeleteNewsletterCustomer
{
    /**
     * Remove um cliente da newsletter e envia uma notificação de cancelamento.
     * A transação foi removida por conter apenas uma operação de escrita.
     *
     * @param NewsletterCustomer $newsletterCustomer O registro do cliente a ser removido.
     * @return NewsletterCustomer
     */
    public function delete(NewsletterCustomer $newsletterCustomer): NewsletterCustomer
    {
        $newsletterCustomer->delete();

        Notification::route('mail', $newsletterCustomer->email)
            ->notify(new DeleteNewsletterCustomerNotification($newsletterCustomer));

        return $newsletterCustomer;
    }
}
