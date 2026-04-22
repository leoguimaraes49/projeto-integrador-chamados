# Definition of Done

## Objetivo

Esta Definition of Done define o criterio minimo para considerar uma tarefa, user story ou incremento como concluido no projeto.

## Criterios gerais

Uma entrega so pode ir para `Done` quando:

- A implementacao atende aos criterios de aceitacao da issue.
- O codigo foi versionado em branch propria.
- O pull request descreve o que foi alterado e como testar.
- Pelo menos uma pessoa do grupo revisou o pull request.
- O codigo nao introduz comportamento fora do escopo combinado.
- O fluxo principal foi testado manualmente.
- Testes automatizados foram adicionados quando houver regra de negocio relevante.
- Lint, build e testes passam localmente ou no CI.
- A documentacao foi atualizada quando a mudanca altera instalacao, execucao, API, banco ou comportamento do usuario.

## Backend

Para tarefas de backend:

- Rotas protegidas validam JWT quando necessario.
- Permissoes por perfil sao verificadas no servidor.
- Entradas do usuario sao validadas.
- Erros retornam status HTTP adequado e mensagem compreensivel.
- Senhas e dados sensiveis nao aparecem em logs ou respostas.
- Alteracoes de banco sao feitas por migrations.
- Variaveis sensiveis ficam fora do repositorio e aparecem apenas no `.env.example` sem valores reais.

## Banco de dados

Para alteracoes no banco:

- A migration cria ou altera schema de forma reproduzivel.
- Relacionamentos e restricoes essenciais sao declarados no banco.
- Campos obrigatorios usam `NOT NULL` quando aplicavel.
- Chaves estrangeiras sao usadas para manter integridade.
- Dados iniciais obrigatorios, como categorias padrao, sao documentados ou versionados.

## Documentacao

Toda mudanca relevante deve manter atualizados:

- README.
- Documento de Visão, se alterar escopo do produto.
- Product Backlog, se criar, remover ou repriorizar stories importantes.
- ADRs, quando houver decisao arquitetural significativa.
- Documentacao da API, quando houver mudanca de contrato.
