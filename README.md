# Sistema de Gerenciamento de Chamados de Suporte Técnico

Projeto desenvolvido para a disciplina GCC267 - Projeto Integrador I.

## Grupo

- Ana Karoliny Ornelas
- Matheus Henrique Bueno Coelho
- César Augusto Nunes Silveira
- Leonardo Guimarães Oliveira

## Responsabilidades na Sprint 1

| Integrante | Responsabilidade principal |
| --- | --- |
| Ana Karoliny Ornelas | Documentação da Sprint Review, retrospectiva e evidências da demonstração. |
| Matheus Henrique Bueno Coelho | Validação dos endpoints da API e roteiro de testes/Postman. |
| César Augusto Nunes Silveira | Testes unitários do backend e revisão das regras implementadas. |
| Leonardo Guimarães Oliveira | Base técnica do backend, organização das issues, PRs e GitHub Projects. |

## Proposta

O projeto consiste no desenvolvimento de um sistema web para gerenciamento de chamados de suporte técnico. Usuários poderão registrar problemas ou solicitações, acompanhar o andamento dos chamados e receber atualizações. Técnicos poderão visualizar, organizar, responder e atualizar os chamados dentro da plataforma.

## Tecnologias e stack

- Frontend: React com Vite
- Backend: Node.js com Express
- Banco de dados: PostgreSQL
- Autenticação: JWT
- Testes: Vitest
- Qualidade/CI: GitHub Actions e SonarCloud

Observação: Docker, Docker Compose, RabbitMQ e deploy ficam fora da Sprint 2 e serão tratados em sprints posteriores.

## Entrega 1

De acordo com o plano da disciplina, a primeira entrega do projeto deve cobrir:

- Grupo e tema/proposta definidos.
- Documento de Visão com escopo, stakeholders e proposta de valor.
- Product Backlog inicial com user stories, critérios de aceitação e priorização.
- Definition of Done inicial da equipe.

Artefatos criados:

- [Checklist da Entrega 1](docs/00-entrega-1-checklist.md)
- [Documento de Visão](docs/01-documento-visao.md)
- [Product Backlog](docs/02-product-backlog.md)
- [Definition of Done](docs/03-definition-of-done.md)

## Sprint 1

O foco da Sprint 1 é construir a base técnica do produto, sem tentar finalizar todos os fluxos do sistema.

Artefatos da Sprint 1:

- [Checklist conforme calendário oficial](docs/sprints/sprint-1-checklist-calendario.md)
- [Escopo da Sprint 1](docs/sprints/sprint-1-escopo.md)
- [Sprint 1 Review](docs/sprints/sprint-1-review.md)
- [Sprint 1 Retrospectiva](docs/sprints/sprint-1-retrospectiva.md)
- [Requests para demonstrar endpoints da Sprint 1](docs/api/sprint-1-requests.http)

GitHub Projects: https://github.com/users/leoguimaraes49/projects/3

## User stories demonstráveis na Sprint 1

As funcionalidades abaixo estao implementadas no backend e podem ser testadas pelos endpoints em `docs/api/sprint-1-requests.http`:

- PB-01 Cadastro de usuario.
- PB-02 Login com JWT.
- PB-04 Abertura de chamado.
- PB-05 Listagem dos meus chamados.
- PB-06 Detalhe de chamado com historico.

## Sprint 2

O foco da Sprint 2 é consolidar a base do produto com segurança, migrations versionadas, CI, métricas de qualidade e protótipo de interface.

Artefatos da Sprint 2:

- [Escopo da Sprint 2](docs/sprints/sprint-2-escopo.md)
- [Checklist da Sprint 2](docs/sprints/sprint-2-checklist.md)
- [Sprint 2 Review](docs/sprints/sprint-2-review.md)
- [Sprint 2 Retrospectiva](docs/sprints/sprint-2-retrospectiva.md)
- [Sprint 3 Planning](docs/sprints/sprint-3-planning.md)
- [Requests da Sprint 2](docs/api/sprint-2-requests.http)

Itens demonstráveis:

- API com headers de segurança e limite nas rotas de autenticação.
- Cadastro público sem permissão para criar técnico/admin.
- Migration `002_ticket_lifecycle_and_audit.sql`.
- Protótipo React para login/cadastro, abertura, listagem e detalhe de chamados.
- CI com testes, migrations, cobertura e build do frontend.

## Estrutura do projeto

```text
backend/    API Node.js + Express, migrations, autenticação, chamados e testes
frontend/   Protótipo React + Vite
docs/       Documentação do projeto, requests de teste e materiais das sprints
```

## Como rodar localmente

Instalar dependências:

```bash
npm run install:backend
npm run install:frontend
```

Rodar backend:

```bash
npm --prefix backend run migrate
npm --prefix backend run dev
```

Rodar frontend:

```bash
npm run dev:frontend
```

Rodar testes do backend:

```bash
npm test
```

Rodar build do frontend:

```bash
npm run build:frontend
```

