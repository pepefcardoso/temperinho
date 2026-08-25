<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentPaidNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Payment $payment
    ) {
        //
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Seu Pagamento foi Confirmado!')
            ->markdown('emails.paid_payment', [
                'greetingName' => $notifiable->name,
                'amount' => number_format((float) $this->payment->amount, 2, ',', '.'),
                'actionText' => 'Acessar Plataforma',
                'actionUrl' => url('/dashboard'),
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'payment_id' => $this->payment->id,
            'amount' => $this->payment->amount,
        ];
    }
}
