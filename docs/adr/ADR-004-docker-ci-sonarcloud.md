# ADR 004 - Docker, GitHub Actions e SonarCloud

## Status

Aceito.

## Contexto

O projeto precisa executar de maneira reproduzivel, impedir merges com falhas conhecidas e fornecer evidencias objetivas de testes e qualidade de codigo.

## Decisao

Padronizar o ambiente com Docker Compose, executar lint, migrations, testes, cobertura e build no GitHub Actions e analisar o codigo no SonarCloud. Depois da CI aprovada na `main`, o pipeline de CD publica imagens no GitHub Container Registry.

## Alternativas consideradas

- Configuracao manual das dependencias em cada computador.
- Jenkins hospedado pela equipe.
- Analise estatica apenas local, sem quality gate nos pull requests.

## Consequencias

- A demonstracao local depende apenas do Docker Desktop.
- Pull requests recebem verificacoes automaticas antes do merge.
- Imagens versionadas ficam disponiveis para implantacao posterior.
- Secrets e permissoes do GitHub precisam ser mantidos corretamente.
