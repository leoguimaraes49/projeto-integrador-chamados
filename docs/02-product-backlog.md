# Product Backlog

## Visao geral

Este backlog inicial usa a tecnica MoSCoW para priorizacao:

- Must: indispensavel para o MVP.
- Should: importante, mas pode ser entregue apos o nucleo funcional.
- Could: melhoria desejavel.
- Won't: fora do escopo inicial.

Estimativa inicial:

- P: pequeno
- M: medio
- G: grande

## Backlog funcional

| ID | Prioridade | MoSCoW | Est. | User story | Criterios de aceitacao |
| --- | --- | --- | --- | --- | --- |
| PB-01 | Alta | Must | M | Como usuario, quero criar uma conta para acessar o sistema de chamados. | Deve exigir nome, e-mail e senha; nao deve permitir e-mail duplicado; senha deve ser armazenada com hash. |
| PB-02 | Alta | Must | M | Como usuario, quero fazer login para acessar funcionalidades protegidas. | Deve autenticar por e-mail e senha; deve retornar JWT valido; credenciais invalidas devem retornar erro claro. |
| PB-03 | Alta | Must | M | Como sistema, quero controlar permissoes por perfil para proteger informacoes sensiveis. | Deve existir perfil de usuario, tecnico e administrador; rotas protegidas devem validar token e perfil; usuario comum nao deve acessar painel tecnico. |
| PB-04 | Alta | Must | M | Como usuario, quero abrir um chamado para solicitar suporte tecnico. | Deve permitir titulo, descricao, categoria e prioridade; chamado deve iniciar como Aberto; solicitante deve ser associado ao chamado. |
| PB-05 | Alta | Must | M | Como usuario, quero listar meus chamados para acompanhar minhas solicitacoes. | Deve exibir apenas chamados do usuario autenticado; deve mostrar status, prioridade e data de abertura; deve ordenar por chamados mais recentes. |
| PB-06 | Alta | Must | M | Como usuario, quero visualizar detalhes de um chamado para entender seu andamento. | Deve mostrar dados principais, status atual e historico; usuario so pode ver chamados proprios; respostas tecnicas devem aparecer em ordem cronologica. |
| PB-07 | Alta | Must | M | Como tecnico, quero visualizar chamados abertos para organizar minha fila de atendimento. | Deve listar chamados abertos e em atendimento; deve permitir filtro por status e prioridade; deve bloquear acesso de usuario comum. |
| PB-08 | Alta | Must | M | Como tecnico, quero assumir um chamado para indicar que estou responsavel pelo atendimento. | Deve registrar tecnico responsavel; status deve mudar para Em atendimento; historico deve registrar a acao. |
| PB-09 | Alta | Must | M | Como tecnico, quero responder um chamado para orientar o usuario. | Deve salvar resposta vinculada ao chamado; deve registrar autor e data; usuario deve conseguir visualizar a resposta. |
| PB-10 | Alta | Must | M | Como tecnico, quero alterar o status de um chamado para refletir seu andamento. | Deve aceitar apenas status validos; deve registrar mudanca no historico; usuario comum nao deve alterar status tecnico. |
| PB-11 | Media | Should | M | Como usuario, quero complementar um chamado para enviar novas informacoes. | Deve permitir nova mensagem no chamado; deve registrar autor e data; tecnico deve visualizar a atualizacao. |
| PB-12 | Media | Should | M | Como administrador, quero cadastrar categorias para organizar os chamados. | Deve permitir criar, editar, listar e desativar categorias; chamado deve usar categoria valida. |
| PB-13 | Media | Should | M | Como administrador, quero gerenciar perfis de usuarios para controlar acessos. | Deve permitir alterar perfil; deve impedir que usuario comum altere o proprio perfil; alteracoes devem ser protegidas por permissao administrativa. |
| PB-14 | Media | Should | G | Como tecnico, quero filtrar chamados por categoria, prioridade e status para encontrar atendimentos relevantes. | Filtros devem poder ser combinados; resultado deve respeitar permissoes; busca sem filtros deve retornar lista padrao. |
| PB-17 | Baixa | Could | M | Como tecnico, quero ver indicadores basicos para entender a carga de trabalho. | Deve exibir total por status e prioridade; dados devem vir da API; acesso deve ser restrito a tecnico ou administrador. |
| PB-19 | Baixa | Could | G | Como administrador, quero visualizar relatorio simples de chamados por periodo. | Deve permitir filtrar por intervalo de datas; deve mostrar quantidade por status e categoria; exportacao nao e obrigatoria no MVP. |
| PB-20 | Baixa | Could | G | Como usuario, quero anexar arquivos ao chamado para enviar evidencias. | Deve aceitar formatos permitidos; deve limitar tamanho; armazenamento deve ser definido antes da implementacao. |

## Backlog tecnico habilitador

| ID | Prioridade | Sprint sugerida | Item tecnico | Criterios de aceitacao |
| --- | --- | --- | --- | --- |
| TEC-01 | Alta | Sprint 1 | Criar estrutura inicial do backend e da documentacao. | Pastas organizadas; scripts basicos documentados; README atualizado. |
| TEC-02 | Alta | Sprint 1 | Configurar backend Express com rotas base. | API inicia localmente; rota de health check responde; tratamento basico de erro existe. |
| TEC-04 | Alta | Sprint 1 | Configurar PostgreSQL local. | Variaveis de ambiente documentadas; conexao backend-banco validada. |
| TEC-05 | Alta | Sprint 1 | Definir schema inicial e migrations. | Tabelas de usuarios, chamados, categorias e historico versionadas por migrations. |
| TEC-06 | Alta | Sprint 1 | Configurar padrao de variaveis de ambiente. | `.env.example` criado; secrets reais nao versionados; aplicacao le configuracoes do ambiente. |
| TEC-07 | Media | Sprint 1 | Configurar lint e formatacao. | Scripts disponiveis; padrao aplicado no backend; instrucoes no README. |
| TEC-08 | Media | Sprint 2 | Configurar testes automatizados iniciais. | Testes de autenticacao e chamados; comando de teste documentado; base pronta para CI. |
| TEC-09 | Media | Sprint 2 | Configurar GitHub Actions. | Pipeline executa install, lint, build e testes; status aparece em PRs. |
| TEC-11 | Baixa | Sprint 3 | Adicionar documentacao OpenAPI/Swagger. | Rotas principais documentadas; README aponta para a documentacao da API. |

## Sugestao de Sprint 1

Objetivo da Sprint 1: entregar a fundacao do produto com autenticacao, abertura de chamados e painel inicial de acompanhamento.

Itens sugeridos:

- PB-01 Cadastro de usuario.
- PB-02 Login com JWT.
- PB-03 Permissoes por perfil.
- PB-04 Abertura de chamado.
- PB-05 Listagem dos meus chamados.
- PB-06 Detalhe de chamado.
- TEC-01 Estrutura inicial do projeto.
- TEC-02 Backend Express.
- TEC-04 PostgreSQL local.
- TEC-05 Schema e migrations.

## Labels sugeridas para GitHub Issues

- `feature`
- `backend`
- `database`
- `auth`
- `tech-debt`
- `docs`
- `priority:high`
- `priority:medium`
- `priority:low`
- `moscow:must`
- `moscow:should`
- `moscow:could`
