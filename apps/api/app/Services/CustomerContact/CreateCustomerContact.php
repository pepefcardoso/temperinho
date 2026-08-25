<?php

namespace App\Services\CustomerContact;

use App\Models\CustomerContact;
use App\Notifications\CustomerContactNotification;
use Illuminate\Support\Facades\Notification;

class CreateCustomerContact
{
    /**
     * Cria um novo registro de contato de cliente e envia uma notificação.
     * A transação foi removida por conter apenas uma operação de escrita.
     *
     * @param array $data Os dados validados para a criação do contato.
     * @return CustomerContact
     */
    public function create(array $data): CustomerContact
    {
        $customerContact = CustomerContact::create($data);

        Notification::route('mail', $customerContact->email)
            ->notify(new CustomerContactNotification($customerContact));

        return $customerContact;
    }
}
