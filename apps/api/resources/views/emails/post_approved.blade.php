@component('mail::message')
# Boas notícias, {{ $post->user->name }}!

Seu artigo **"{{ $post->title }}"** foi aprovado e já está publicado no {{ config('app.name') }}.

@component('mail::button', ['url' => url('/usuario/artigos')])
Ver meus artigos
@endcomponent

Atenciosamente,<br>
{{ config('app.name') }}
@endcomponent
