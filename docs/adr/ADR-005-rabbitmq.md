# ADR 005 - RabbitMQ para eventos de chamados

## Status

Aceito.

## Contexto

A criacao, atribuicao, resposta ou mudanca de status pode gerar notificacoes e outros processamentos. Essas tarefas nao devem aumentar o tempo de resposta nem impedir a operacao principal quando o consumidor estiver temporariamente indisponivel.

## Decisao

Publicar eventos de chamados em um exchange RabbitMQ e processa-los por um worker separado. O fluxo principal continua funcional quando a mensageria nao esta configurada.

## Alternativas consideradas

- Processar notificacoes diretamente durante a requisicao HTTP.
- Usar Redis Pub/Sub.
- Consultar periodicamente o banco em busca de alteracoes.

## Consequencias

- A API fica desacoplada do processamento de notificacoes.
- Mensagens duraveis podem ser consumidas de forma assincrona.
- RabbitMQ e o worker adicionam servicos que precisam de monitoramento.
- Novos consumidores podem ser adicionados sem alterar o fluxo principal da API.
