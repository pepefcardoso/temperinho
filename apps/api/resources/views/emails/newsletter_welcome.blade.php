@component('mail::message')
# Olá!

Obrigado por se inscrever na nossa newsletter!

A partir de agora, você receberá as últimas novidades, promoções e atualizações diretamente no seu e-mail
({{ $customer->email }}).

Se você não se inscreveu ou deseja cancelar a assinatura, clique no botão abaixo:

@component('mail::button', ['url' => $unsubscribeUrl, 'color' => 'red'])
Cancelar Inscrição
@endcomponent

Estamos felizes em tê-lo conosco!

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent
