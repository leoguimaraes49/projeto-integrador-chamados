# Historico das Sprints

## Sprint 1 - Historico

### Objetivo

A Sprint 1 teve como objetivo estabelecer a base do Sistema de Gerenciamento de Chamados de Suporte Técnico, definindo sua arquitetura inicial e implementando os principais componentes necessários para o funcionamento do backend, autenticação de usuários, banco de dados e primeiros serviços da aplicação.

### Itens planejados

- Definir a proposta do produto.
- Criar a estrutura inicial do backend com Node.js e Express.
- Configurar autenticacao com JWT.
- Criar estrutura inicial do banco com migrations.
- Implementar endpoints iniciais de usuarios e chamados.
- Criar testes automatizados iniciais.
- Documentar a Sprint 1 e os requests de demonstracao.

### Itens entregues

- API Express estruturada.
- Health check disponivel.
- Cadastro de usuario via API.
- Login com JWT.
- Criacao de chamados.
- Listagem dos chamados do usuario.
- Detalhe do chamado com historico.
- Migration inicial do banco PostgreSQL.
- Testes automatizados do backend.
- Documentacao da Sprint 1 com escopo, review, retrospectiva e requests de teste.

### Evidencias

- Arquivos em `docs/sprints/`.
- Requests em `docs/api/sprint-1-requests.http`.
- Testes do backend em `backend/tests/`.
- Migration inicial em `backend/src/db/migrations/001_init.sql`.
- README com proposta, stack, integrantes e instrucoes iniciais.

### Resultado

Ao término da Sprint 1, o projeto passou a contar com uma base técnica funcional e organizada, incluindo autenticação de usuários, banco de dados versionado e os principais serviços relacionados ao gerenciamento de chamados, possibilitando a evolução do sistema nas etapas seguinte

## Sprint 2 - Historico

### Objetivo

A Sprint 2 teve como foco a consolidação da estrutura desenvolvida anteriormente, por meio da implementação de melhorias de segurança, evolução do modelo de dados, criação do protótipo da interface web e adoção de práticas de integração contínua e qualidade de software.

### Itens planejados

- Revisar a seguranca da autenticacao.
- Impedir cadastro publico com perfil privilegiado.
- Adicionar headers HTTP de seguranca.
- Aplicar limite de tentativas nas rotas de autenticacao.
- Criar migration de evolucao do banco.
- Criar prototipo inicial em React.
- Diferenciar interface de usuario e tecnico.
- Configurar GitHub Actions.
- Preparar integracao com SonarCloud.

### Itens entregues

- Cadastro publico limitado ao perfil de usuario comum.
- Middleware de seguranca com Helmet.
- Rate limit nas rotas de autenticacao.
- Migration `002_ticket_lifecycle_and_audit.sql`.
- Prototipo React com login, cadastro, abertura, listagem e detalhe de chamados.
- Tela de tecnico com listagem, atribuicao, resposta e alteracao de status.
- CI com testes, migrations e build do frontend.
- Configuracao inicial do SonarCloud.
- Documentacao da Sprint 2 com escopo, checklist, review e retrospectiva.

### Evidencias

- Arquivos em `docs/sprints/sprint-2-*`.
- Requests em `docs/api/sprint-2-requests.http`.
- Workflow em `.github/workflows/ci.yml`.
- Arquivo `sonar-project.properties`.
- Commits da branch `sprint-2-base`.
- PR da Sprint 2 aprovado e integrado na `main`.

### Resultado

Ao final da Sprint 2, o sistema evoluiu para uma aplicação web funcional, incorporando mecanismos adicionais de segurança, uma interface gráfica utilizável, banco de dados versionado, testes automatizados e processos de qualidade contínua.

## Sprint 3 - Historico

### Objetivo

A Sprint 3 teve como objetivo ampliar a infraestrutura da aplicação, tornando o ambiente mais próximo de um cenário real de implantação. Foram incorporadas tecnologias de conteinerização, mensageria, processamento assíncrono e melhorias significativas na experiência de uso do sistema.

### Itens planejados

- Containerizar a aplicacao com Docker e Docker Compose.
- Configurar PostgreSQL no ambiente Docker.
- Integrar RabbitMQ ao fluxo de chamados.
- Criar worker para consumir eventos de chamados.
- Atualizar README com execucao completa do ambiente.
- Criar diagrama de arquitetura.
- Melhorar a interface do sistema para usuario e tecnico.
- Validar testes, build e SonarCloud no PR.

### Itens entregues

- Docker Compose com frontend, backend, PostgreSQL, RabbitMQ e worker.
- Banco PostgreSQL configurado com migrations e seed automaticos no ambiente Docker.
- RabbitMQ integrado aos eventos de chamados.
- Worker de notificacoes consumindo eventos da fila.
- Publicacao de eventos ao criar chamado, responder chamado e alterar status.
- Testes automatizados para regras de chamados e publicacao de eventos.
- Diagrama de arquitetura documentado.
- README atualizado com instrucoes de Docker, banco e RabbitMQ.
- Frontend melhorado visualmente, com layout mais profissional e responsivo.
- Tela de tecnico com resumo, lista de chamados, detalhe e acoes rapidas.
- Tela de usuario com melhor organizacao mobile e destaque dos chamados.
- PR da Sprint 3 aprovado, com CI e SonarCloud passando.

### Evidencias

- `docker-compose.yml`.
- `backend/src/queues/`.
- `backend/src/workers/notificationWorker.js`.
- `backend/tests/ticketEventPublisher.test.js`.
- `docs/arquitetura/diagrama-arquitetura.md`.
- README com instrucoes de execucao via Docker.
- PR #9 aprovado e integrado na `main`.
- Checks aprovados: backend, frontend build, SonarCloud scan e SonarCloud Code Analysis.

### Resultado

Ao final da Sprint 3, o sistema atingiu um nível mais avançado de maturidade, contando com frontend, backend, banco de dados, mensageria, processamento assíncrono, testes automatizados e documentação arquitetural. A utilização do Docker Compose simplificou a configuração do ambiente, tornando a aplicação mais adequada para demonstrações e futuras evoluções.
