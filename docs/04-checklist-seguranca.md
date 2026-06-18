# Checklist de Seguranca

Revisao final realizada em 18/06/2026 com base nas praticas discutidas na Sprint 2.

## Autenticacao e autorizacao

- [x] Senhas armazenadas com bcrypt.
- [x] Cadastro publico limitado ao perfil `user`.
- [x] Rotas protegidas exigem JWT.
- [x] Operacoes tecnicas validam o perfil no backend.
- [x] Credenciais invalidas retornam mensagem generica.
- [x] Rotas de autenticacao possuem limite de tentativas.

## Entrada, banco e respostas

- [x] Campos obrigatorios sao validados na camada de servico.
- [x] Status, prioridade e categoria sao validados.
- [x] Consultas SQL utilizam parametros posicionais.
- [x] Usuarios comuns acessam somente seus chamados.
- [x] Erros internos nao retornam stack trace ao cliente.
- [x] Corpos JSON possuem limite de tamanho.

## Configuracao e infraestrutura

- [x] Secrets reais nao sao versionados.
- [x] `.env.example` documenta as variaveis necessarias.
- [x] Helmet configura headers HTTP de seguranca.
- [x] CORS utiliza lista de origens permitidas.
- [x] Containers de aplicacao executam sem usuario root.
- [x] Dependencias foram verificadas com `npm audit`.
- [x] Imagens e servicos possuem health checks quando aplicavel.

## Qualidade continua

- [x] CI executa lint, testes, cobertura e build.
- [x] SonarCloud analisa pull requests e a branch principal.
- [x] O regex de e-mail apontado como hotspot foi substituido.
- [x] Pull requests usam um checklist de seguranca padrao.

## Evidencias

- `.github/workflows/ci.yml`
- `.github/pull_request_template.md`
- `backend/src/app.js`
- `backend/src/middleware/auth.js`
- `backend/src/services/authService.js`
- `backend/src/services/ticketService.js`
- `backend/Dockerfile`
- `frontend/Dockerfile`
