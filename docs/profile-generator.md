# VF Contribution Engine

O perfil é gerado por um pequeno pipeline TypeScript. A camada de dados consulta a API GraphQL oficial do GitHub, normaliza a resposta em modelos internos e entrega esses modelos a dois renderizadores independentes: o dashboard técnico e o VF Energy Beam.

## Arquitetura

```text
GitHub GraphQL API ou fixture
              |
              v
      ProfileData normalizado
          /             \
         v               v
Dashboard Renderer   Contribution Matrix
                          |
                          v
                VF Energy Beam Renderer
          \               /
           v             v
        validação XML, segurança e tamanho
                       |
                       v
                 branch output
```

- `scripts/profile/github/`: cliente, consultas, paginação e normalização.
- `scripts/profile/dashboard/`: componentes e renderer do Command Center.
- `scripts/profile/contribution-beam/`: matriz 7×52/53, VF Core e animação.
- `scripts/profile/fixtures/`: dados determinísticos para desenvolvimento sem API.
- `scripts/profile/validation/`: validação XML, acessibilidade, tamanho e recursos proibidos.

## Origem e significado dos dados

As contribuições, commits, pull requests e issues representam o período devolvido por `contributionsCollection`. Contribuições privadas entram apenas como agregados quando a configuração do perfil e o escopo do token permitem. Repositórios são contados entre os repositórios próprios acessíveis ao token.

As linguagens são agregadas pelos bytes informados em `Repository.languages`. Isso não mede linguagens por commit, por isso o painel usa explicitamente o rótulo “Linguagens dos repositórios”. Consulte a [referência GraphQL de usuários](https://docs.github.com/en/graphql/reference/users) e a [documentação de autenticação GraphQL](https://docs.github.com/en/graphql/guides/forming-calls-with-graphql#authenticating-with-graphql).

## Desenvolvimento local

Requisitos: Node.js 20.19 ou superior.

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run generate:mock
npm run validate
```

Para dados reais, defina `GITHUB_TOKEN` apenas no ambiente e execute `npm run generate`. Nunca grave o token em arquivo versionado. `PROFILE_OUTPUT_DIR` permite escolher outro diretório de saída.

## Publicação e fallback

O workflow roda diariamente, manualmente e quando o próprio motor muda. Ele valida código, testes e uma geração mock antes de consultar o GitHub. Os arquivos reais são gerados em staging, validados e somente então copiados para a branch `output`. Se a API, o build ou a validação falhar, o job termina antes da publicação e os últimos SVGs válidos permanecem disponíveis.

O secret opcional `SUMMARY_GITHUB_TOKEN` permite incluir métricas privadas agregadas conforme as permissões oficiais. Sem ele, o workflow usa o token efêmero do repositório e gera apenas o que estiver acessível.

## Compatibilidade

Os SVGs usam `viewBox`, `<title>`, `<desc>`, elementos vetoriais nativos, gradientes, filtros simples e animações SMIL. Não usam JavaScript, `foreignObject`, recursos remotos nem handlers de evento. O README incorpora os arquivos como imagens da branch `output`, dentro de `<picture>` para dark/light mode. Essa abordagem respeita a sanitização agressiva do HTML descrita pelo [pipeline oficial do GitHub Markup](https://github.com/github/markup) e mantém toda a animação encapsulada no arquivo de imagem.

## Solução de problemas

- `GITHUB_TOKEN não foi informado`: exporte o token no processo ou use `npm run generate:mock`.
- GraphQL retorna dados incompletos: confirme o login e os escopos do token; dados privados nunca são inferidos.
- Um SVG falha: rode `npm run validate`; o erro indica XML inválido, ausência de metadados, excesso de tamanho ou recurso inseguro.
- O README mostra uma versão anterior: o cache de imagens do GitHub pode demorar; confirme primeiro o arquivo na branch `output`.
