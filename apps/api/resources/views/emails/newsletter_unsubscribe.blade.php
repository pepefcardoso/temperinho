@component('mail::message')
# Olá!

Lamentamos informar que o seu e-mail ({{ $customer->email }}) foi removido da nossa lista de newsletter.

Se isso foi um erro ou se deseja se reinscrever, por favor, visite nosso site e inscreva-se novamente.

@component('mail::button', ['url' => $siteUrl])
Visitar o Site
@endcomponent

Agradecemos por ter feito parte da nossa comunidade.

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent
