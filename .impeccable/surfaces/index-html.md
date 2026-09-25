---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: ["en/index.html"]
---

# Surface brief: portfólio (index.html + en/index.html)

Scope: a página única do portfólio, PT em /dev/ e EN em /dev/en/. Visitor mode: Experience, com a exigência de conversão de Persuade: o recrutador tem que achar cargo, stack, CV e contato em menos de 10 s sem assistir nada.
Audience/job: recrutador tech BR triando vagas Full Stack Pleno→Sênior; em seguida, o tech lead avaliando profundidade.
Action: baixar o CV, mandar e-mail, abrir LinkedIn/GitHub.
Proof/content: experiência real (Lifters, MarjoSports, UEPB) e os cases confirmados (Orion, Smartico Pages, tags GTM em shadow DOM, dashboard analítico interno, Sentinela, Jogo Responsável; fichas locais, fora do repositório). Não citar marcas de aposta nem nomes internos de produto; não inventar métricas; toda demonstração com dado rotulada "dados fictícios".
Constraints: estático vanilla multi-arquivo no GitHub Pages; manter o preloader de boot, o nome com scramble e os easter eggs ASCII; scroll nativo (nada de sequestro de wheel/teclado); prefers-reduced-motion e controle de pausa; conteúdo real no HTML; PT e EN indexáveis.
Memorable moment: a Fig. 1 explode camada por camada enquanto a requisição (peça 1) atravessa o eixo, e no fim a folha recebe o selo DEFERIDO.
Unresolved: domínio próprio; CV em inglês (só existe o PDF em PT); status de disponibilidade.

## Direction contract

THESIS: O portfólio é um pedido de patente de invenção, "Sistema e método para entregar software do pixel ao deploy", com Thiago Diniz como inventor. Recusa o padrão da categoria: hero escuro com neon e grade de cards de projeto.

OWN-WORLD: Folha de desenho de patente. Nanquim #141414 sobre bond branco frio #FBFBF8, moldura dupla regrada, carimbo de legenda com FOLHA n DE 9, hachura a 45° como único preenchimento e carmim #B11E2B só na peça em exame. Old Standard TT em caixa-alta espaçada nos títulos e numerais de figura, Source Serif 4 no relatório descritivo, Courier Prime como voz de máquina. Linhas de chamada curvas terminam em numerais; eixos tracejados.

STORY: Numa folha o recrutador entende quem é o inventor (cargo, stack, desde 2023). Acredita porque cada peça numerada leva a uma especificação e a cases reais. Age: baixa a especificação completa (CV) ou protocola contato.

FIRST VIEWPORT: A moldura da folha ocupa a tela, com o carimbo no topo (título da invenção · FOLHA 1 DE 9 · botão CV). Coluna estreita à esquerda com INVENTOR, cargo, base e status. No centro, THIAGO DINIZ gigante em caixa-alta espaçada, "Desenvolvedor Full Stack — React · Java/Spring · AWS" e os botões Baixar CV (primário) e Ver Fig. 2. À direita, a Fig. 1 montada, com numerais 10–50 e a lista de referência.

FORM: Prancha de patente de utilidade, desafiante do catálogo que venceu a rodada (não estava na minha lista de 7; a atribuída era a 6ª, terminal de mercado). Seed 392fffb7. Assinatura: a Fig. 2 explode no scroll ao longo de eixos tracejados, com amortecimento, enquanto a esfera 1 percorre o eixo e volta como selo "200 — DEFERIDO". Passar ou clicar num numeral estica a linha de chamada em carmim e destaca o parágrafo da especificação. Gramática de movimento: linhas se desenham como plotter, peças deslizam no eixo com mola, carimbos pressionam; nada de fade genérico.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
