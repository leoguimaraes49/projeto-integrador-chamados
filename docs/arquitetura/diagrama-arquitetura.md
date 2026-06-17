# Diagrama de Arquitetura

Este documento registra a arquitetura atual do sistema de gerenciamento de chamados.

## Visao geral

```mermaid
flowchart LR
  usuario["Usuario solicitante"]
  tecnico["Tecnico de suporte"]

  subgraph navegador["Navegador"]
    frontend["Frontend React + Vite"]
  end

  subgraph docker["Ambiente Docker Compose"]
    nginx["Nginx\nserve build do frontend"]
    api["Backend Node.js + Express\nAPI REST"]
    worker["Worker de notificacoes\nNode.js"]
    db[("PostgreSQL\nbanco chamados")]
    rabbit[("RabbitMQ\nexchange ticket.events\nfila ticket.notifications")]
  end

  usuario --> frontend
  tecnico --> frontend
  frontend --> nginx
  frontend -- "HTTP/JSON" --> api
  api -- "SQL" --> db
  api -- "publica eventos" --> rabbit
  rabbit -- "consome mensagens" --> worker
  worker -- "logs de notificacao" --> logs["Logs do container"]
```

## Fluxo principal de chamados

```mermaid
sequenceDiagram
  actor U as Usuario
  participant F as Frontend React
  participant A as Backend Express
  participant D as PostgreSQL
  participant R as RabbitMQ
  participant W as Worker

  U->>F: Preenche e envia chamado
  F->>A: POST /api/tickets com JWT
  A->>D: Grava ticket e evento ticket_created
  D-->>A: Retorna dados gravados
  A->>R: Publica evento ticket_created
  A-->>F: Retorna chamado criado
  R-->>W: Entrega mensagem da fila
  W->>W: Registra notificacao simulada no log
```

## Fluxo de atendimento tecnico

```mermaid
sequenceDiagram
  actor T as Tecnico
  participant F as Frontend React
  participant A as Backend Express
  participant D as PostgreSQL
  participant R as RabbitMQ
  participant W as Worker

  T->>F: Assume, responde ou altera status
  F->>A: POST/PATCH em /api/tickets/:id
  A->>D: Atualiza chamado e historico
  D-->>A: Retorna atualizacao
  A->>R: Publica evento ticket_assigned, message_added ou status_changed
  A-->>F: Retorna chamado/evento atualizado
  R-->>W: Entrega evento ao worker
  W->>W: Registra notificacao simulada no log
```

## Componentes e responsabilidades

| Componente | Tecnologia | Responsabilidade |
| --- | --- | --- |
| Frontend | React + Vite | Interface de usuario e tecnico, consumo da API REST |
| Nginx | nginx:alpine | Servir o build estatico do frontend no Docker |
| Backend | Node.js + Express | Autenticacao JWT, regras de chamado, endpoints REST |
| PostgreSQL | postgres:16-alpine | Persistencia de usuarios, categorias, chamados, historico e migrations |
| RabbitMQ | rabbitmq:3-management-alpine | Mensageria assincrona de eventos de chamados |
| Worker | Node.js | Consumir fila `ticket.notifications` e simular notificacoes em log |
| GitHub Actions | CI | Rodar testes, migrations, cobertura, build e SonarCloud |
| SonarCloud | Qualidade | Analise estatica e quality gate |

## Containerizacao

```mermaid
flowchart TB
  compose["docker-compose.yml"]
  compose --> db["db\nPostgreSQL\nporta host 5433"]
  compose --> rabbit["rabbitmq\nAMQP 5672\npainel 15672"]
  compose --> backend["backend\nAPI 3001"]
  compose --> worker["worker\nconsumidor RabbitMQ"]
  compose --> frontend["frontend\nNginx 5173"]

  backend --> db
  backend --> rabbit
  worker --> rabbit
  frontend --> backend
```

## Decisoes arquiteturais principais

- O frontend fica separado do backend para manter responsabilidades claras entre interface e API.
- O backend concentra regras de negocio e validacoes antes de gravar no banco.
- O PostgreSQL e usado como fonte de verdade dos dados do sistema.
- O RabbitMQ e usado para eventos assincronos de chamados, sem bloquear a criacao ou atualizacao do chamado.
- O worker processa notificacoes fora do fluxo principal da API.
- Docker Compose padroniza o ambiente de demonstracao e reduz problemas de configuracao local.
