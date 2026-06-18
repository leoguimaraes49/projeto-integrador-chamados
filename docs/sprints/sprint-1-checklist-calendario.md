# Sprint 1 - Checklist do Calendario de Entregas

Prazo oficial: 22/04/2026, quarta-feira.

Review em aula: 23/04/2026, quinta-feira.

## 1. Repositorio e infraestrutura basica

| Exigencia | Status | Evidencia |
| --- | --- | --- |
| Estrutura de pastas coerente | Feito | `backend/`, `docs/`, `docs/sprints/`, `docs/api/` |
| `.gitignore` configurado | Feito | `.gitignore` ignorando `node_modules`, `.env`, `dist`, `coverage` |
| README inicial | Feito | Objetivo, grupo, stack, execucao e link do GitHub Projects |
| Branch protection | Feito | `main` exige pull request e uma aprovacao |

## 2. Produto - funcionalidades Sprint 1

Minimo exigido: 3 user stories completamente implementadas e demonstraveis.

User stories ja cobertas por endpoints testaveis:

| User story | Status | Como demonstrar |
| --- | --- | --- |
| PB-01 Cadastro de usuario | Implementada no backend | `POST /api/auth/register` |
| PB-02 Login com JWT | Implementada no backend | `POST /api/auth/login` |
| PB-04 Abertura de chamado | Implementada no backend | `POST /api/tickets` |
| PB-05 Listagem dos meus chamados | Implementada no backend | `GET /api/tickets` |
| PB-06 Detalhe de chamado | Implementada no backend | `GET /api/tickets/:id` |

Roteiro de teste: `docs/api/sprint-1-requests.http`.

## 3. Processo de desenvolvimento

| Exigencia | Status | Observacao |
| --- | --- | --- |
| GitHub Projects com issues da Sprint 1 | Feito | Issues e pull requests vinculados ao board. |
| Issues tecnicas da Sprint 1 concluidas | Feito | Implementacao e testes incorporados nas sprints seguintes. |
| Participacao individual | Acompanhamento externo | Conferida pelo historico de contribuicoes do GitHub. |
| Revisoes de pull request | Feito | Branch protection exige aprovacao antes do merge. |

## 4. Testes

| Exigencia | Status | Evidencia |
| --- | --- | --- |
| Testes unitarios das funcionalidades implementadas | Feito | `backend/tests/authService.test.js` e `backend/tests/ticketService.test.js` |
| Suite rodando sem falhas | Feito | `npm --prefix backend test` |

## 5. O que nao esta nesta entrega

Segundo o calendario, estes itens ficam formalmente para a Sprint 2:

- GitHub Actions.
- SonarCloud.
- Cobertura minima formal.
