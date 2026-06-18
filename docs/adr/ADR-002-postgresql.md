# ADR 002 - PostgreSQL como banco de dados

## Status

Aceito.

## Contexto

Usuarios, categorias, chamados e eventos possuem relacionamentos e regras de integridade. O historico de atendimento precisa ser rastreavel e alteracoes de schema devem ser reproduziveis entre os ambientes.

## Decisao

Utilizar PostgreSQL como fonte de verdade e versionar o schema por migrations SQL executadas pelo backend.

## Alternativas consideradas

- MySQL, com capacidades relacionais semelhantes.
- MongoDB, com modelo orientado a documentos.
- Armazenamento em memoria, adequado apenas para prototipos descartaveis.

## Consequencias

- Chaves estrangeiras e restricoes preservam a integridade dos dados.
- Consultas e filtros podem aproveitar indices relacionais.
- O ambiente precisa disponibilizar uma instancia PostgreSQL.
- Toda alteracao de schema deve ser adicionada como uma nova migration.
