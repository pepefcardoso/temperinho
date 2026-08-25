<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class PaymentCreated extends Notification implements ShouldQueue
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
            ->subject('Nova Fatura Gerada para sua Assinatura')
            ->markdown('emails.created_payment', [
                'greetingName' => $notifiable->name,
                'amount' => number_format((float) $this->payment->amount, 2, ',', '.'),
                'dueDate' => Carbon::parse($this->payment->due_date)->format('d/m/Y'),
                'actionText' => 'Ver Fatura',
                'actionUrl' => url('/dashboard/billing'),
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'payment_id' => $this->payment->id,
            'amount' => $this->payment->amount,
            'due_date' => $this->payment->due_date,
        ];
    }
}
