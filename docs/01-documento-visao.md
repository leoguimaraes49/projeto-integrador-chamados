# Documento de Visão

## 1. Identificação

Projeto: Sistema de Gerenciamento de Chamados de Suporte Técnico

Disciplina: GCC267 - Projeto Integrador I

Grupo:

- Ana Karoliny Ornelas
- Matheus Henrique Bueno Coelho
- César Augusto Nunes Silveira
- Leonardo Guimarães Oliveira

## 2. Problema

Em muitos ambientes academicos, administrativos ou corporativos, solicitacoes de suporte tecnico sao registradas por canais informais, como mensagens, conversas presenciais ou e-mails dispersos. Isso dificulta o controle de prioridade, o acompanhamento do andamento, a distribuicao de tarefas entre tecnicos e a consulta ao historico de atendimento.

Essa falta de centralizacao pode gerar chamados esquecidos, retrabalho, ausencia de rastreabilidade e dificuldade para medir a qualidade do atendimento.

## 3. Solucao proposta

Desenvolver uma aplicacao web para centralizar o registro, acompanhamento e atendimento de chamados de suporte tecnico. A plataforma permitira que usuarios criem chamados, descrevam o problema, definam categoria e prioridade, acompanhem o status e visualizem respostas da equipe tecnica.

Tecnicos terao uma area propria para visualizar chamados abertos, assumir atendimentos, responder usuarios, alterar status e registrar historico de evolucao. Administradores poderao gerenciar usuarios, categorias e acompanhar indicadores basicos do suporte.

## 4. Proposta de valor

O sistema reduz a desorganizacao do suporte tecnico ao oferecer um fluxo unico para abertura, acompanhamento e resolucao de chamados. Para usuarios, o valor esta na transparencia do atendimento. Para tecnicos, esta na organizacao da fila de trabalho. Para gestores ou administradores, esta na visibilidade sobre volume, prioridade e status das solicitacoes.

## 5. Publico-alvo

- Usuarios que precisam solicitar suporte tecnico.
- Tecnicos responsaveis por atender os chamados.
- Administradores ou coordenadores que precisam acompanhar a operacao de suporte.

## 6. Stakeholders

| Stakeholder | Interesse no sistema |
| --- | --- |
| Usuario solicitante | Abrir chamados, acompanhar status e receber respostas. |
| Tecnico de suporte | Organizar a fila de atendimento, responder chamados e registrar a evolucao. |
| Administrador | Gerenciar usuarios, categorias, tecnicos e acompanhar indicadores. |
| Professor avaliador | Avaliar requisitos, arquitetura, qualidade, documentacao e evolucao do projeto. |
| Equipe de desenvolvimento | Construir o produto aplicando boas praticas de engenharia de software. |

## 7. Objetivos do produto

- Centralizar o registro de chamados de suporte tecnico.
- Permitir acompanhamento claro do status de cada chamado.
- Organizar a fila de atendimento dos tecnicos.
- Registrar historico de interacoes e mudancas de status.
- Separar permissoes por perfil de usuario.
- Utilizar uma arquitetura web com backend, banco relacional e autenticacao.
- Entregar uma base tecnica evolutiva para as proximas sprints da disciplina.

## 8. Escopo do MVP

O produto minimo viavel deve incluir:

- Cadastro e login de usuarios.
- Autenticacao via JWT.
- Perfis de acesso: usuario, tecnico e administrador.
- Criacao de chamados com titulo, descricao, categoria e prioridade.
- Listagem de chamados do usuario autenticado.
- Visualizacao detalhada de um chamado.
- Historico de respostas e mudancas de status.
- Painel tecnico com chamados abertos ou atribuidos.
- Atualizacao de status por tecnicos.
- Registro de resposta tecnica.
- Persistencia dos dados em PostgreSQL.

## 9. Fora do escopo inicial

Os itens abaixo podem ser considerados em sprints futuras, mas nao fazem parte do MVP inicial:

- Aplicativo mobile nativo.
- Chat em tempo real.
- Integracao com WhatsApp, Telegram ou e-mail institucional.
- SLA avancado com calendario de feriados e horarios comerciais.
- Base de conhecimento completa.
- Relatorios gerenciais avancados.
- Integracao com sistemas externos de ITSM.

## 10. Perfis de usuario

### Usuario solicitante

Pessoa que abre chamados de suporte e acompanha o andamento das solicitacoes.

Principais necessidades:

- Registrar um problema de forma simples.
- Saber se o chamado foi recebido.
- Consultar status e respostas.
- Adicionar informacoes complementares.

### Tecnico de suporte

Pessoa responsavel por atender chamados, organizar prioridades e registrar solucoes.

Principais necessidades:

- Visualizar chamados pendentes.
- Filtrar por prioridade, categoria e status.
- Assumir um chamado.
- Responder ao usuario.
- Atualizar status e registrar a resolucao.

### Administrador

Pessoa responsavel por manter a configuracao basica do sistema.

Principais necessidades:

- Gerenciar usuarios e perfis.
- Gerenciar categorias de chamados.
- Visualizar indicadores basicos.
- Apoiar auditoria e organizacao do atendimento.

## 11. Requisitos funcionais iniciais

| ID | Requisito |
| --- | --- |
| RF-01 | O sistema deve permitir cadastro de usuarios. |
| RF-02 | O sistema deve autenticar usuarios com e-mail e senha. |
| RF-03 | O sistema deve emitir token JWT para usuarios autenticados. |
| RF-04 | O sistema deve proteger rotas conforme o perfil do usuario. |
| RF-05 | O usuario deve poder abrir um chamado. |
| RF-06 | O usuario deve poder listar seus proprios chamados. |
| RF-07 | O usuario deve poder visualizar detalhes e historico de um chamado. |
| RF-08 | O tecnico deve poder listar chamados abertos ou atribuidos a ele. |
| RF-09 | O tecnico deve poder assumir um chamado. |
| RF-10 | O tecnico deve poder responder um chamado. |
| RF-11 | O tecnico deve poder alterar o status de um chamado. |
| RF-12 | O sistema deve registrar historico de respostas e mudancas de status. |
| RF-13 | O administrador deve poder gerenciar categorias de chamados. |
| RF-14 | O administrador deve poder gerenciar perfis de usuarios. |

## 12. Requisitos nao funcionais iniciais

| ID | Requisito |
| --- | --- |
| RNF-01 | A aplicacao deve separar API e banco de dados. |
| RNF-02 | A API deve seguir padroes REST. |
| RNF-03 | Senhas devem ser armazenadas com hash seguro. |
| RNF-04 | Dados sensiveis devem ser configurados por variaveis de ambiente. |
| RNF-05 | O ambiente local deve ter instrucoes claras de configuracao e execucao. |
| RNF-06 | O codigo deve ser versionado no GitHub. |
| RNF-07 | O projeto deve possuir README com instrucoes de execucao. |
| RNF-08 | O backend deve possuir testes automatizados para regras principais. |
| RNF-09 | A interface deve ser responsiva para uso em desktop e dispositivos moveis. |
| RNF-10 | A arquitetura deve permitir evolucao para notificacoes e relatorios sem reescrever o fluxo principal. |

## 13. Regras de negocio iniciais

- Todo chamado deve possuir um solicitante.
- Um chamado deve iniciar com status `Aberto`.
- Status previstos: `Aberto`, `Em atendimento`, `Aguardando usuario`, `Resolvido`, `Fechado` e `Cancelado`.
- Prioridades previstas: `Baixa`, `Media`, `Alta` e `Critica`.
- Usuarios comuns so podem visualizar seus proprios chamados.
- Tecnicos podem visualizar chamados abertos, chamados atribuidos a si e chamados sob sua responsabilidade.
- Somente tecnicos ou administradores podem alterar status de atendimento.
- O historico de um chamado nao deve ser apagado em operacoes comuns.
- Cada mudanca relevante deve registrar data, autor e descricao.

## 14. Stack tecnologica

| Camada | Tecnologia | Justificativa |
| --- | --- | --- |
| Backend | Node.js + Express | Stack simples, produtiva e adequada para APIs REST. |
| Banco de dados | PostgreSQL | Banco relacional robusto para chamados, usuarios, historico e filtros. |
| Autenticacao | JWT | Permite autenticacao stateless e protecao de rotas da API. |

## 15. Criterios de sucesso

- Um usuario consegue se cadastrar, autenticar e abrir um chamado.
- Um usuario consegue acompanhar seus chamados e visualizar respostas.
- Um tecnico consegue visualizar a fila, assumir um chamado e atualizar o atendimento.
- O historico de alteracoes fica registrado.
- A aplicacao roda localmente com instrucoes claras.
- O backlog esta organizado e priorizado.
- O escopo do MVP esta claro para as proximas sprints.

## 16. Riscos e mitigacoes

| Risco | Impacto | Mitigacao |
| --- | --- | --- |
| Escopo crescer demais | Atraso nas entregas | Manter foco no MVP e priorizar Must Have. |
| Modelagem de permissoes ficar confusa | Falhas de seguranca | Definir perfis desde o inicio e testar rotas protegidas. |
| Falta de padrao no codigo | Dificuldade de manutencao | Usar lint, padroes de commits e revisoes em PR. |
| Banco sem migrations | Dificuldade de evolucao | Adotar migrations desde as primeiras tabelas. |

## 17. Definition of Done inicial

Uma funcionalidade so deve ser considerada pronta quando:

- Atende aos criterios de aceitacao definidos.
- Possui validacoes basicas de entrada.
- Respeita as regras de autorizacao do perfil envolvido.
- Foi testada manualmente no fluxo principal.
- Possui testes automatizados quando envolver regra de negocio.
- Nao quebra build, lint ou testes existentes.
- Esta documentada quando altera comportamento, rota ou configuracao.
- Foi revisada por pelo menos uma pessoa do grupo antes de ser concluida.
