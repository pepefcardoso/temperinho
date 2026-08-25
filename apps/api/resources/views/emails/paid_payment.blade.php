@component('mail::message')
# Olá, {{ $greetingName }}!

Confirmamos o recebimento do seu pagamento no valor de **R$ {{ $amount }}**.

Sua assinatura está ativa. Agradecemos por escolher nossos serviços!

@component('mail::button', ['url' => $actionUrl])
{{ $actionText }}
@endcomponent

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent
