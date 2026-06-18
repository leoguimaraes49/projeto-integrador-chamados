# ADR 001 - React, Node.js e Express

## Status

Aceito.

## Contexto

O produto precisa oferecer uma interface web responsiva e uma API REST separada, com autenticacao, regras de permissao e integracao com PostgreSQL e RabbitMQ. A equipe tambem precisa de uma stack simples de executar localmente e adequada ao tempo da disciplina.

## Decisao

Utilizar React com Vite no frontend e Node.js com Express no backend. O frontend consome a API por HTTP e o backend concentra autenticacao, autorizacao e regras de negocio.

## Alternativas consideradas

- Aplicacao monolitica renderizada no servidor com templates Express.
- Next.js para frontend e backend no mesmo framework.
- Django ou Spring Boot no backend.

## Consequencias

- Frontend e backend podem evoluir e ser implantados separadamente.
- A equipe trabalha com JavaScript nas duas camadas.
- Contratos da API precisam ser documentados e versionados.
- CORS e URLs de ambiente precisam ser configurados corretamente.
