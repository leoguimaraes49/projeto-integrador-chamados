# Sprint 1 - Escopo e Entrega Parcial

## Objetivo da Sprint

Construir a base tecnica do sistema de chamados para que o restante do grupo consiga evoluir o produto com commits separados, revisoes e entregas incrementais.

Prazo oficial da entrega: 22/04/2026.

Review em aula: 23/04/2026.

## O que esta Sprint 1 deve demonstrar

- Repositorio organizado com backend e documentacao.
- API Express estruturada em camadas.
- Banco PostgreSQL modelado com migration inicial.
- Autenticacao JWT planejada e implementada no backend.
- Fluxo inicial de chamados no backend.
- Endpoints testaveis para pelo menos 3 user stories.
- Testes automatizados das regras mais importantes do backend.
- Divisao clara das proximas tarefas entre os membros do grupo.

## Escopo implementado nesta base

### Backend

- Estrutura Express com `app`, `routes`, `services`, `repositories`, `middleware` e `db`.
- Health check em `GET /health`.
- Cadastro e login em `/api/auth`.
- Middleware de autenticacao JWT.
- Rotas iniciais de chamados em `/api/tickets`.
- Rotas de categorias em `/api/categories`.
- Regras iniciais de permissao:
  - usuario comum ve apenas seus chamados;
  - tecnico e administrador podem atuar no atendimento.
- Services testaveis sem depender diretamente do banco.
### Banco de dados

- Migration inicial com tabelas:
  - `users`;
  - `categories`;
  - `tickets`;
  - `ticket_events`.
- Categorias iniciais:
  - Hardware;
  - Software;
  - Rede;
  - Acesso e contas.

## Fora do escopo desta base

Estes itens nao devem ser cobrados como prontos nesta parte inicial:

- Tela completa de login/cadastro.
- Tela completa de abertura/listagem/detalhe de chamados.
- Painel tecnico refinado.
- Gerenciamento administrativo de usuarios e categorias.
- Anexos em chamados.
- Relatorios.
- Deploy em nuvem.
- CI/CD completo.
- SonarCloud.
- Notificacoes reais por e-mail ou websocket.

## User stories da Sprint 1

| ID | Status nesta base | Observacao |
| --- | --- | --- |
| PB-01 Cadastro de usuario | Implementada via API | Demonstrar com `POST /api/auth/register`. |
| PB-02 Login com JWT | Implementada via API | Demonstrar com `POST /api/auth/login`. |
| PB-04 Abertura de chamado | Implementada via API | Demonstrar com `POST /api/tickets`. |
| PB-05 Listagem dos meus chamados | Implementada via API | Demonstrar com `GET /api/tickets`. |
| PB-06 Detalhe de chamado | Implementada via API | Demonstrar com `GET /api/tickets/:id`. |

O calendario permite "interface ou endpoints" desde que sejam testaveis. Nesta base, a demonstracao da Sprint 1 fica pelos endpoints.

## Definition of Done especifica da Sprint 1

Para considerar a Sprint 1 concluida pelo grupo:

- Backend inicia com `npm --prefix backend run dev`.
- Migration roda sem erro.
- Health check responde.
- Testes do backend passam.
- Pelo menos 3 user stories sao demonstradas por endpoints testaveis.
- Issues da Sprint 1 devem estar registradas no GitHub Projects.
- Cada membro deve ter pelo menos um commit relevante.
- Review e retrospectiva devem ser preenchidas antes da apresentacao.
