# Sprint 1 Review

## Sprint Goal

Entregar a base tecnica do sistema de chamados, permitindo que o grupo evolua os fluxos principais em commits separados.

## Incremento demonstravel

- API Express estruturada.
- Health check disponivel.
- Migration inicial do PostgreSQL.
- Autenticacao JWT no backend.
- Rotas iniciais de chamados.
- Testes automatizados iniciais no backend.

## O que ficou parcial

- Fluxos existem no backend e sao demonstrados por endpoints.
- CI/CD ainda precisa ser configurado no GitHub Actions.
- SonarCloud ainda nao foi configurado.

## Evidencias sugeridas para apresentar

- Mostrar estrutura de pastas.
- Acessar `http://localhost:3001/health`.
- Rodar `npm --prefix backend test`.
- Executar requests de `docs/api/sprint-1-requests.http`.
- Mostrar migration `backend/src/db/migrations/001_init.sql`.
- Mostrar testes em `backend/tests/`.

## Feedback recebido

Preencher apos a apresentacao da Sprint 1.

## Ajustes para a Sprint 2

Preencher apos feedback do professor e da turma.

## Objetivo explicado para a review

A Sprint 1 teve como objetivo entregar a fundacao tecnica do produto, com foco em backend, banco de dados, autenticacao e endpoints demonstraveis. A proposta foi evitar escopo excessivo e garantir uma base organizada para as proximas sprints.
