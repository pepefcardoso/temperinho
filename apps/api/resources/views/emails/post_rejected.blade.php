@component('mail::message')
# Olá, {{ $post->user->name }}!

Seu artigo **"{{ $post->title }}"** não foi aprovado para publicação.

**Motivo:**
{{ $post->rejection_reason }}

Você pode ajustar o conteúdo e enviar novamente para revisão.

@component('mail::button', ['url' => url('/usuario/artigos')])
Ver meus artigos
@endcomponent

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent
