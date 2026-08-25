@component('mail::message')
# Olá, {{ $greetingName }}!

Uma nova fatura no valor de **R$ {{ $amount }}** foi gerada para a sua assinatura.

O vencimento é em **{{ $dueDate }}**.

@component('mail::button', ['url' => $actionUrl])
{{ $actionText }}
@endcomponent

Você pode realizar o pagamento via PIX. Se já efetuou o pagamento, por favor, desconsidere este e-mail.

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent
