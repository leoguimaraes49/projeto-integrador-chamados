# Sprint 2 - Checklist

## Seguranca de API

| Exigencia | Status | Evidencia |
| --- | --- | --- |
| Revisao de vulnerabilidade em autenticacao | Feito | Cadastro publico sempre gera perfil `user` |
| Headers HTTP de seguranca | Feito | Middleware `helmet` no Express |
| Limite de tentativas em autenticacao | Feito | `express-rate-limit` em `/api/auth` |
| Checklist de seguranca revisado nos PRs | Feito | `docs/04-checklist-seguranca.md` e template padrao de PR |

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
| Validacao com usuario/grupo | Feito | `docs/05-validacao-usabilidade.md` |

## Qualidade

| Exigencia | Status | Evidencia |
| --- | --- | --- |
| Testes automatizados | Feito | `npm.cmd --prefix backend test` |
| Cobertura gerada | Feito | `npm.cmd --prefix backend run coverage`, com foco na camada de servicos |
| CI configurado | Feito | `.github/workflows/ci.yml` |
| SonarCloud configurado | Feito | Quality Gate aprovado e cobertura geral superior a 70% |

## Review

| Item | Status |
| --- | --- |
| Demo tecnica da API | Pronto |
| Demo do prototipo React | Pronto |
| Metricas de qualidade | Concluido |
| Retrospectiva da Sprint 2 | Concluido |
| Sprint 3 Backlog | Concluido |
