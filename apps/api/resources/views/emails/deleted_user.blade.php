@component('mail::message')
# Prezado(a) {{ $user->name }},

Informamos que sua conta no {{ config('app.name') }} foi removida de nossos sistemas.

**Detalhes da conta removida:**
- **E-mail:** {{ $user->email }}
- **Data de remoção:** {{ now()->format('d/m/Y H:i') }}

Todos os dados associados a esta conta foram permanentemente excluídos.

Caso isto tenha sido um engano, entre em contato conosco imediatamente.

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent
