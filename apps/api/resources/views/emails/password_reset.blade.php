@component('mail::message')
# Olá, {{ $userName }}!

Você está recebendo este e-mail porque recebemos um pedido de redefinição de senha para a sua conta. Clique no botão
abaixo para escolher uma nova senha.

@component('mail::button', ['url' => $resetUrl])
Redefinir Senha
@endcomponent

Este link de redefinição de senha expirará em 60 minutos.

Se você não solicitou uma redefinição de senha, nenhuma ação adicional é necessária.

Atenciosamente,<br>
Equipe Temperinho
@endcomponent
