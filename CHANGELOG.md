# Changelog

Todas as alteracoes relevantes do projeto sao registradas neste arquivo. O formato segue Keep a Changelog e as versoes seguem versionamento semantico.

## [Unreleased]

### Added

- Documentacao OpenAPI com interface Swagger.
- ESLint no backend, frontend e pipeline de CI.
- Pipeline de CD para publicacao de imagens no GitHub Container Registry.
- Logs estruturados de requisicoes, API, migrations e mensageria.
- ADRs completos, checklist de seguranca e evidencia de usabilidade.

### Changed

- Containers de aplicacao configurados para usuarios sem privilegios.
- Validacao de e-mail revisada para evitar expressao regular vulneravel.
- Dependencias atualizadas para versoes sem vulnerabilidades conhecidas.

## [0.3.0] - 2026-06-17

### Added

- PostgreSQL e RabbitMQ orquestrados por Docker Compose.
- Worker assincrono para eventos de chamados.
- Diagramas de arquitetura e fluxos do sistema.
- Melhorias visuais e responsivas no dashboard.

## [0.2.0] - 2026-05-28

### Added

- Frontend React com fluxos de solicitante e tecnico.
- Migration de ciclo de vida e auditoria dos chamados.
- GitHub Actions e integracao com SonarCloud.
- Headers de seguranca e limite de tentativas de autenticacao.

## [0.1.0] - 2026-04-22

### Added

- API inicial com cadastro, login JWT e chamados.
- Migration inicial do PostgreSQL.
- Testes unitarios de autenticacao e regras de chamados.
- Documento de Visao, Product Backlog e Definition of Done.
