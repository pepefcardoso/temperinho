@component('mail::message')
# Olá, {{ $subscription->company->name }}.

Informamos que a sua subscrição do plano **{{ $subscription->plan->name }}** expirou no dia {{ $subscription->ends_at->format('d/m/Y') }}.

Para continuar a usufruir de todos os benefícios, por favor, renove a sua subscrição.

@component('mail::button', ['url' => url('/plans')])
Ver Planos e Renovar
@endcomponent

Se tiver alguma dúvida, por favor entre em contato connosco.

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent
