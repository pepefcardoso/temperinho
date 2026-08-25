@component('mail::message')
# Olá, {{ $subscription->company->name }}!

A sua subscrição do plano **{{ $subscription->plan->name }}** foi ativada com sucesso.

**Detalhes da sua subscrição:**
- **Plano:** {{ $subscription->plan->name }}
- **Início:** {{ $subscription->starts_at->format('d/m/Y') }}
- **Expira em:** {{ $subscription->ends_at->format('d/m/Y') }}

Obrigado por escolher os nossos serviços.

@component('mail::button', ['url' => url('/')])
Aceder à sua conta
@endcomponent

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent
