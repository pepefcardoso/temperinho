<?php

namespace App\Services\CustomerContact;

use App\Models\CustomerContact;

class UpdateCustomerContactStatus
{
    /**
     * Atualiza o status de um contato de cliente.
     * A transação foi removida por conter apenas uma operação de escrita.
     *
     * @param CustomerContact $contact O contato a ser atualizado.
     * @param int $newStatus O novo status.
     * @return CustomerContact
     */
    public function update(CustomerContact $contact, int $newStatus): CustomerContact
    {
        $contact->status = $newStatus;
        $contact->save();

        return $contact;
    }
}
