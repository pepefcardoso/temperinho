<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\CustomerContact;

class CustomerContactNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $customerContact;

    public function __construct(CustomerContact $customerContact)
    {
        $this->customerContact = $customerContact;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Agradecemos por entrar em contato!')
            ->view('emails.customer_contact', ['contact' => $this->customerContact]);
    }
}
