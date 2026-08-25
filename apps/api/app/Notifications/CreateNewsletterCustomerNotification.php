<?php

namespace App\Notifications;

use App\Models\NewsletterCustomer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CreateNewsletterCustomerNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $customer;

    public function __construct(NewsletterCustomer $customer)
    {
        $this->customer = $customer;
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
        $unsubscribeUrl = url('/api/newsletter/' . $this->customer->id);

        return (new MailMessage)
            ->subject('Bem-vindo à nossa newsletter!')
            ->view('emails.newsletter_welcome', [
                'customer' => $this->customer,
                'unsubscribeUrl' => $unsubscribeUrl,
            ]);
    }
}
