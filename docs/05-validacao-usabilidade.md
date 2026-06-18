# Validacao de Usabilidade

## Escopo

Validacao manual dos fluxos principais do prototipo em desktop e dispositivo movel, realizada durante o fechamento das Sprints 2 e 3.

## Cenarios verificados

| Cenario | Resultado |
| --- | --- |
| Cadastro encaminha para login sem autenticar automaticamente | Aprovado |
| Login como solicitante | Aprovado |
| Login como tecnico | Aprovado |
| Abertura, listagem e detalhe de chamado | Aprovado |
| Historico e envio de mensagens | Aprovado |
| Tecnico assume e atualiza o status | Aprovado |
| Solicitante responde quando o status aguarda usuario | Aprovado |
| Resposta do solicitante retoma o atendimento | Aprovado |
| Logout limpa os dados de acesso do formulario | Aprovado |
| Troca entre login e cadastro limpa alertas antigos | Aprovado |
| Feedback de sucesso, erro e carregamento | Aprovado |
| Navegacao em desktop | Aprovado |
| Navegacao em viewport movel sem rolagem horizontal | Aprovado |

## Heuristicas consideradas

- Visibilidade do estado do sistema por mensagens e estados de carregamento.
- Correspondencia com o dominio por rotulos em portugues.
- Consistencia de botoes, status, prioridades e formularios.
- Prevencao de erros por validacao de campos e confirmacao visual.
- Reconhecimento em vez de memorizacao por credenciais demonstrativas e acoes contextuais.

## Ajustes incorporados

- Cadastro deixou de autenticar automaticamente.
- Interfaces de solicitante e tecnico foram separadas.
- Acoes de assumir, responder e resolver foram destacadas para tecnicos.
- Estado do chamado selecionado e mensagens de sucesso foram reforcados.
- Solicitante passou a responder chamados aguardando usuario, retomando o atendimento.
- Logout passou a limpar credenciais e estados temporarios da sessao.
- Quantidade de chamados e mensagens de status foram ajustadas para linguagem natural.
- Layout foi reorganizado para desktop e dispositivos moveis.
- Contraste e rotulos de formularios foram revisados.

## Resultado

Os fluxos essenciais ficaram demonstraveis pela interface e coerentes com as permissoes aplicadas pela API.
