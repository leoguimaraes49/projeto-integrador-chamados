# Sistema de Gerenciamento de Chamados de Suporte Tecnico

[![CI](https://github.com/leoguimaraes49/projeto-integrador-chamados/actions/workflows/ci.yml/badge.svg)](https://github.com/leoguimaraes49/projeto-integrador-chamados/actions/workflows/ci.yml)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=leoguimaraes49_projeto-integrador-chamados&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=leoguimaraes49_projeto-integrador-chamados)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=leoguimaraes49_projeto-integrador-chamados&metric=coverage)](https://sonarcloud.io/component_measures?id=leoguimaraes49_projeto-integrador-chamados&metric=coverage)

Aplicacao web desenvolvida para a disciplina GCC267 - Projeto Integrador I. O produto centraliza a abertura, o acompanhamento e o atendimento de chamados de suporte tecnico.

## Funcionalidades

### Solicitante

- Cadastro e login com JWT.
- Abertura de chamado por categoria e prioridade.
- Listagem e consulta do historico dos proprios chamados.
- Envio de informacoes adicionais durante o atendimento.

### Tecnico

- Acesso separado por perfil.
- Visualizacao da fila de chamados.
- Atribuicao de chamados, respostas e mudancas de status.
- Indicadores resumidos de volume e prioridade.

### Plataforma

- Persistencia em PostgreSQL com migrations versionadas.
- Eventos assincronos de chamados com RabbitMQ.
- Logs estruturados e health checks.
- Analise automatica com ESLint, Vitest, GitHub Actions e SonarCloud.

## Grupo

| Integrante | Responsabilidade principal |
| --- | --- |
| Ana Karoliny Ornelas | Documentacao de reviews, retrospectivas e evidencias das sprints. |
| Matheus Henrique Bueno Coelho | Validacao da API e registro das decisoes arquiteturais. |
| Cesar Augusto Nunes Silveira | Testes do backend e revisao das regras implementadas. |
| Leonardo Guimaraes Oliveira | Integracao tecnica, arquitetura, banco, mensageria e DevOps. |

## Tecnologias

- Frontend: React e Vite.
- Backend: Node.js e Express.
- Banco de dados: PostgreSQL.
- Autenticacao: JWT.
- Mensageria: RabbitMQ.
- Testes: Vitest.
- Qualidade: ESLint e SonarCloud.
- CI/CD: GitHub Actions e GitHub Container Registry.
- Containerizacao: Docker e Docker Compose.

## Arquitetura

- [Diagrama de arquitetura](docs/arquitetura/diagrama-arquitetura.md)
- [ADR 001 - React, Node.js e Express](docs/adr/ADR-001-stack-react-node-express.md)
- [ADR 002 - PostgreSQL](docs/adr/ADR-002-postgresql.md)
- [ADR 003 - JWT](docs/adr/ADR-003-jwt.md)
- [ADR 004 - Docker, CI e SonarCloud](docs/adr/ADR-004-docker-ci-sonarcloud.md)
- [ADR 005 - RabbitMQ](docs/adr/ADR-005-rabbitmq.md)

## Pre-requisitos

Para a execucao recomendada:

- Docker Desktop com Docker Compose.
- Portas `3001`, `5173`, `5433`, `5672` e `15672` livres.

Para desenvolvimento sem containers:

- Node.js 20 ou superior.
- npm.
- PostgreSQL 16.
- RabbitMQ, opcional para os fluxos assincronos.

## Execucao com Docker

Na raiz do repositorio:

```bash
npm run docker:up
```

O comando constroi e inicia PostgreSQL, RabbitMQ, API, worker e frontend. As migrations e os usuarios de demonstracao sao criados automaticamente.

| Servico | Endereco |
| --- | --- |
| Frontend | `http://localhost:5173` |
| API | `http://localhost:3001` |
| Swagger UI | `http://localhost:3001/api-docs` |
| OpenAPI JSON | `http://localhost:3001/api-docs.json` |
| RabbitMQ Management | `http://localhost:15672` |
| PostgreSQL | `localhost:5433` |

Credenciais de demonstracao:

```text
Solicitante: usuario.demo@example.com / 123456
Tecnico: tecnico.demo@example.com / 123456
RabbitMQ: guest / guest
PostgreSQL: postgres / postgres
```

Comandos de operacao:

```bash
npm run docker:logs
npm run docker:down
```

## Desenvolvimento local

Instale as dependencias:

```bash
npm run install:backend
npm run install:frontend
```

Crie `backend/.env` a partir de [backend/.env.example](backend/.env.example) e ajuste a conexao com o PostgreSQL. Depois execute:

```bash
npm --prefix backend run migrate
npm run seed:demo
npm run dev:backend
```

Em outro terminal:

```bash
npm run dev:frontend
```

Para consumir RabbitMQ fora do Docker, configure `AMQP_URL` e execute:

```bash
npm run worker:notifications
```

## Documentacao da API

O contrato completo esta em [backend/openapi.yaml](backend/openapi.yaml). Com o backend iniciado, a interface Swagger fica disponivel em `http://localhost:3001/api-docs`.

Os roteiros manuais usados nas sprints permanecem em:

- [Requests da Sprint 1](docs/api/sprint-1-requests.http)
- [Requests da Sprint 2](docs/api/sprint-2-requests.http)

## Qualidade e testes

```bash
npm run lint
npm test
npm run coverage
npm run build:frontend
```

Para conferir vulnerabilidades conhecidas nas dependencias:

```bash
npm --prefix backend audit
npm --prefix frontend audit
```

A configuracao de cobertura exige no minimo 70% de statements e linhas e 80% de funcoes nas camadas selecionadas.

## CI/CD

O workflow de CI executa lint, migrations, testes, cobertura, build do frontend e SonarCloud em pull requests e atualizacoes da `main`.

Depois de uma CI aprovada na `main`, o workflow de CD publica imagens versionadas no GitHub Container Registry:

```text
ghcr.io/leoguimaraes49/chamados-backend:latest
ghcr.io/leoguimaraes49/chamados-frontend:latest
```

Para gerar a imagem do frontend com uma API hospedada, configure a variavel `DEPLOY_API_URL` no repositorio antes de executar o CD.

## Gestao e documentacao

- [GitHub Projects](https://github.com/users/leoguimaraes49/projects/3)
- [Documento de Visao](docs/01-documento-visao.md)
- [Product Backlog](docs/02-product-backlog.md)
- [Definition of Done](docs/03-definition-of-done.md)
- [Checklist de seguranca](docs/04-checklist-seguranca.md)
- [Validacao de usabilidade](docs/05-validacao-usabilidade.md)
- [Historico de versoes](CHANGELOG.md)

## Contribuicao

1. Selecione uma issue no GitHub Projects.
2. Crie uma branch curta a partir de `main`.
3. Use Conventional Commits, por exemplo `feat:`, `fix:`, `test:` ou `docs:`.
4. Execute lint, testes e build antes do envio.
5. Abra um pull request descrevendo a mudanca e como valida-la.
6. Aguarde os checks e pelo menos uma aprovacao antes do merge.

## Licenca

Distribuido sob a licenca MIT. Consulte [LICENSE](LICENSE).
