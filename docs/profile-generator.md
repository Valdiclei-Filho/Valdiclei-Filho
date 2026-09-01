# VF Contribution Engine

O perfil é um sistema de apresentação composto por sete painéis SVG independentes. Todos são produzidos pelo mesmo gerador TypeScript, usam a mesma largura lógica e compartilham tokens, temas e validação. O README contém somente a sequência dos painéis e duas linhas mínimas de links clicáveis.

## Fluxo de dados e renderização

```text
GitHub GraphQL API ou fixture determinística
                    |
                    v
            ProfileData normalizado
        ____________|________________
       |             |                |
 painéis       telemetria      Contribution Matrix
 estáticos        SVG                  |
                                      v
                              Target Selector
                                      |
                                      v
                    Timeline > Beam > Impact > Core
        \____________|________________/
                     v
       validação XML, segurança e tamanho
                     |
                     v
            staging > branch output
```

Chamadas HTTP permanecem em `scripts/profile/github/`. Os renderers recebem apenas modelos internos; nenhum renderer conhece tokens, endpoints ou autenticação.

## Design system

`scripts/profile/design-system.ts` centraliza:

- canvas de `1000` unidades, margem externa de `28`, unidade base de `8`, raio de `10` e header de `52`;
- hierarquia `eyebrow`, `section`, `title`, `value`, `body`, `label` e `metadata`;
- intensidade dos glows do core, feixe e impacto;
- geometria da matriz, posição do core e duração do targeting.

`scripts/profile/theme.ts` fornece dark e light mode com significado estável: cyan representa interface e mira; green representa atividade e sucesso; orange é reservado ao disparo e impacto; texto e muted mantêm a hierarquia de conteúdo. `panel-shell.ts` desenha o frame compartilhado por todos os painéis.

## Painéis gerados

Cada tema produz:

1. `identity-panel`: identidade, especialização, localização e estado profissional;
2. `stack-panel`: stack principal agrupada e trilha de evolução;
3. `profile-dashboard`: métricas oficiais, sinal anual e linguagens por bytes;
4. `contribution-targeting`: matriz anual e targeting animado;
5. `modules-panel`: três subsistemas operacionais horizontais;
6. `directives-projects`: princípios e canais de projetos;
7. `terminal-panel`: contato, localização e fluxo de entrega.

Os arquivos dark/light não são duplicados manualmente. O gerador executa o mesmo renderer com um `ProfileTheme` diferente e publica os 14 nomes definidos em `scripts/profile/assets.ts`.

## Seleção determinística de alvos

`target-selector.ts` considera apenas células com `count > 0` nas últimas 53 semanas. A matriz é dividida em quatro segmentos temporais e o candidato mais relevante de cada segmento é escolhido por contagem, nível, recência e posição. Se algum segmento não possuir atividade, o preenchimento prioriza distância das células já selecionadas.

O mesmo conjunto de dados sempre gera os mesmos alvos e a mesma ordem. Cada `BeamTarget` registra data, contagem, nível, semana, dia, coordenadas, posição na sequência e instante inicial. As coordenadas são o centro exato da célula:

```text
x = gridX + weekIndex * (cell + gapX) + cell / 2
y = gridY + weekday   * (cell + gapY) + cell / 2
```

Sem contribuições, a matriz permanece visível, o painel mostra `NO ACTIVE TARGET` e nenhuma geometria inválida é criada.

## Timeline e targeting

São selecionados até quatro alvos. Cada alvo ocupa um slot de cinco segundos, sem disparos simultâneos:

```text
0.00–0.70  SCAN
0.70–1.20  TARGET ACQUIRED
1.20–2.00  CORE CHARGE
2.00–2.35  TARGET LOCK
2.35–2.70  FIRE
2.70–3.20  IMPACT
3.20–4.00  RESIDUAL ENERGY
4.00–5.00  COOLDOWN
```

O ciclo completo dura vinte segundos. `beam-renderer.ts` cria duas linhas somente entre o centro do VF Core e o centro do alvo: glow difuso e energia central. `impact-renderer.ts` anima apenas a célula escolhida, com crescimento proporcional ao nível, anel residual e duas partículas discretas. `target-timeline.ts` apresenta o estado atual. O core possui somente um anel funcional de carga.

Se SMIL não executar, o fallback continua exibindo frame, título, core, matriz, intensidade oficial e métricas; feixes e impactos partem de opacidade zero.

## Desenvolvimento local

Requisitos: Node.js 20.19 ou superior.

```bash
npm ci
npm run build
npm run typecheck
npm run lint
npm test
npm run generate:mock
npm run validate
```

`npm run generate:mock` usa a fixture completa de 53×7 dias. Para dados reais, defina `GITHUB_TOKEN` somente no ambiente e execute `npm run generate`. `PROFILE_OUTPUT_DIR` altera o diretório de saída.

## Publicação segura

O workflow diário/manual valida fonte, testes, fixture e XML antes da consulta real. Os 14 arquivos são gerados em staging e copiados para `output` somente depois que todos passam. Falha de API, build ou validação encerra o job antes da publicação, preservando a última versão válida. `SUMMARY_GITHUB_TOKEN` é opcional e pode incluir apenas os agregados privados oficialmente disponíveis ao titular.

## Compatibilidade e validação

Os SVGs usam `viewBox`, `title`, `desc`, primitivas vetoriais, gradientes locais, filtros simples e SMIL. Não usam JavaScript, handlers, `foreignObject`, fontes remotas, imagens incorporadas ou recursos externos. O validador rejeita esses recursos, XML inválido, ausência de acessibilidade e arquivos acima do limite configurado.

O README usa `<picture>` para escolher o tema e conserva alt text. A inspeção visual deve incluir 1024, 768, 480 e 320 px, além de quadros estáticos e ativos da animação.

## Troubleshooting

- `GITHUB_TOKEN não foi informado`: use `npm run generate:mock` ou exporte o token no processo.
- `NO ACTIVE TARGET`: a matriz fornecida não possui célula com `count > 0`; não é falha.
- SVG anterior continua visível: confirme primeiro a branch `output`; o cache do GitHub pode atrasar a atualização.
- `spawn EPERM` no `tsx`: em ambiente restrito, execute `node --import tsx --test scripts/profile/tests/profile-engine.test.ts`.
- validação falha: `npm run validate` informa o asset e a regra violada.
