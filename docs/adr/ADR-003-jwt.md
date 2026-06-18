# ADR 003 - JWT para autenticacao

## Status

Aceito.

## Contexto

A API precisa identificar solicitantes, tecnicos e administradores sem manter uma sessao de servidor para cada navegador. Rotas de chamados devem validar o perfil antes de liberar dados ou operacoes.

## Decisao

Emitir um JSON Web Token apos cadastro ou login e exigir o token Bearer nas rotas protegidas. O backend valida assinatura e perfil em middleware proprio.

## Alternativas consideradas

- Sessao armazenada no servidor com cookie de sessao.
- OAuth 2.0 por um provedor externo.
- Chaves de API fixas por usuario.

## Consequencias

- A API permanece stateless e pode ser escalada sem compartilhar sessoes.
- O segredo de assinatura deve permanecer fora do repositorio.
- Tokens emitidos continuam validos ate expirarem, salvo implementacao futura de revogacao.
- O frontend precisa proteger o token e envia-lo no cabecalho `Authorization`.
