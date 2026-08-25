<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PasswordResetNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $token;
    public $userName;

    public function __construct($userName, $token)
    {
        $this->userName = $userName;
        $this->token = $token;
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
        $resetUrl = url(config('app.frontend_url') . '/reset-password?' . http_build_query([
            'token' => $this->token,
            'email' => $notifiable->email,
        ]));

        return (new MailMessage)
            ->subject('Redefinição de Senha - Temperinho')
            ->view('emails.password_reset', [
                'userName' => $this->userName,
                'resetUrl' => $resetUrl,
            ]);
    }
}
