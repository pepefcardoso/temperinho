@component('mail::message')
# Olá, {{ $user->name }}!

Sua conta no {{ config('app.name') }} foi criada com sucesso.

**Detalhes da conta:**
- **E-mail:** {{ $user->email }}
- **Data de criação:** {{ $user->created_at->format('d/m/Y H:i') }}

@component('mail::button', ['url' => url('/login')])
Acessar sua conta
@endcomponent

Se você não reconhece esta ação, por favor entre em contato conosco.

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent
