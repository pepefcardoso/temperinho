@component('mail::message')
# Olá, {{ $contact->name }}!

Agradecemos por entrar em contato conosco. Recebemos sua mensagem e retornaremos em breve.

**Resumo da sua solicitação:**
- **E-mail:** {{ $contact->email }}
- **Telefone:** {{ $contact->phone }}
- **Mensagem:** {{ $contact->message }}

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent
