# Sprint 2 - Checklist

## Seguranca de API

| Exigencia | Status | Evidencia |
| --- | --- | --- |
| Revisao de vulnerabilidade em autenticacao | Feito | Cadastro publico sempre gera perfil `user` |
| Headers HTTP de seguranca | Feito | Middleware `helmet` no Express |
| Limite de tentativas em autenticacao | Feito | `express-rate-limit` em `/api/auth` |
| Checklist de seguranca revisado nos PRs | Pendente | A ser conferido nas revisoes dos integrantes |

## Banco de dados e migrations

| Exigencia | Status | Evidencia |
| --- | --- | --- |
| Schema versionado com migrations | Feito | `backend/src/db/migrations/001_init.sql` e `002_ticket_lifecycle_and_audit.sql` |
| Evolucao de modelagem da Sprint 2 | Feito | Campos `last_login_at`, `due_at`, `closed_at` e indices adicionais |
| Migration executavel localmente | Feito | `npm.cmd --prefix backend run migrate` |

## Interface

| Exigencia | Status | Evidencia |
| --- | --- | --- |
| Prototipo de interface validavel | Feito | `frontend/` com React + Vite |
| Fluxo de login/cadastro | Feito | Tela inicial do prototipo |
| Fluxo de abertura/listagem/detalhe de chamados | Feito | Dashboard do prototipo |
| Area do tecnico | Feito | Lista chamados, assume atendimento, responde e altera status |
| Validacao com usuario/grupo | Pendente | Registrar feedback antes da review |

## Qualidade

| Exigencia | Status | Evidencia |
| --- | --- | --- |
| Testes automatizados | Feito | `npm.cmd --prefix backend test` |
| Cobertura gerada | Feito | `npm.cmd --prefix backend run coverage`, com foco na camada de servicos |
| CI configurado | Feito | `.github/workflows/ci.yml` |
| SonarCloud preparado | Feito parcial | `sonar-project.properties`, falta segredo `SONAR_TOKEN` no GitHub |

## Review

| Item | Status |
| --- | --- |
| Demo tecnica da API | Pronto |
| Demo do prototipo React | Pronto |
| Metricas de qualidade | Em andamento |
| Retrospectiva da Sprint 2 | Em andamento |
| Sprint 3 Backlog | Em andamento |
