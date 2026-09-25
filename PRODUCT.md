# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Estático vanilla, multi-arquivo: HTML/CSS/JS e assets (imagens, CV) em arquivos separados, sem framework nem build obrigatório. Publicado no GitHub Pages (repo `thiago-fv-diniz/dev`, branch `main`, raiz; hoje em `https://thiago-fv-diniz.github.io/dev/`). Escolha do usuário em 2026-09-25, substituindo o arquivo único atual.

## Users

- **Primário:** recrutadores de tech no Brasil triando candidatos para vagas FullStack de Pleno a Sênior (CLT/PJ). Chegam pelo LinkedIn, pelo CV ou pelo README do GitHub, com muitos candidatos abertos e pouco tempo. Precisam achar em segundos cargo, senioridade, stack, experiência, localização, contato e CV.
- **Secundário:** tech leads / hiring managers que avaliam profundidade técnica e acabamento depois da triagem.
- Idioma: PT-BR primeiro; EN como versão secundária completa.

## Product Purpose

Portfólio pessoal de Thiago Felipe Viana Diniz, desenvolvedor FullStack (Pleno, mirando Sênior). Existe para gerar convites de entrevista. Sucesso: o recrutador chega ao contato/CV, sai com a impressão de alguém sério, sênior e diferente, e lembra do site depois; o site aparece em buscas pelo nome dele.

## Positioning

Profundidade real na stack inteira — React/Next.js no front, Java/Spring no back, dados e mensageria, AWS — construída em produção desde 2023 em plataformas de aposta de alto tráfego, onde o que se move é dinheiro. Somada a um ofício de interface acima da média (motion, canvas, acabamento), que o próprio site demonstra em vez de só afirmar.

## Operating Context

- Entradas: link do LinkedIn (linkedin.com/in/thiago-diniz-dev), CV e README do perfil do GitHub (github.com/thiago-fv-diniz, que aponta para o portfólio).
- Triagem em aba de navegador, geralmente no desktop, às vezes no celular; comparação com outros candidatos.
- Buscas pelo nome ("Thiago Diniz", "Thiago Felipe Viana Diniz") devem levar ao site.

## Capabilities and Constraints

- Hoje o site tem: PT/EN, download do CV, copiar e-mail, link do LinkedIn, easter eggs ASCII no hero.
- Contato: thiagof.vdiniz@gmail.com · LinkedIn `thiago-diniz-dev` · GitHub `thiago-fv-diniz` (ainda não linkado no site). Localização: João Pessoa, Paraíba, BR.
- Link de WhatsApp existe comentado no código — continua oculto até o usuário decidir.
- Precisa continuar estático e servido pelo GitHub Pages; o build legacy do Pages roda Jekyll, então arquivos de documentação (PRODUCT.md, DESIGN.md) precisam ser excluídos da publicação.
- Mobile usa scroll nativo; prefers-reduced-motion precisa ser respeitado.
- **Decisões em aberto:** domínio próprio (vs. subpath `/dev/`); status de disponibilidade ("aberto a oportunidades").

## Brand Commitments

- **Obrigatórios (confirmados pelo usuário em 2026-09-25):** o preloader de boot, o nome com scramble de glifos até formar THIAGO DINIZ e os easter eggs ASCII (tetris, pong, donut 3D e cia.). Podem ser redesenhados para o mundo novo, mas não removidos.
- **Não obrigatórios:** carreira em formato git log e o conceito "requisição atravessando a stack até o 200 OK" podem ser substituídos se houver algo mais forte.
- Existentes no site, ainda não confirmados como obrigatórios: monograma "TD", tagline "do pixel ao deploy", voz direta e técnica com humor seco ("time > ego", "chato de tão previsível"), rodapé "feito à mão · zero template · view-source friendly".

## Evidence on Hand

- **Experiência (real, do CV):** Lifters — FullStack Pleno, set/2024 → agora, plataforma de apostas multimarca (React 17/TypeScript + Java/Spring + PostgreSQL). MarjoSports — FullStack Júnior, nov/2023 → set/2024 (Angular, integrações backend, Node.js e Python em AWS Lambda); Estágio, jan/2023 → nov/2023 (testes funcionais, triagem com SQL e Git). B.Sc. Ciência da Computação — UEPB.
- **O usuário confirmou (2026-09-25):** pode nomear empresas e descrever cases. Cases liberados: **Orion** (plataforma de apostas esportivas e cassino), **Smartico Pages** (gamificação em sites de apostas, plataforma Sportingtech), **tags GTM em shadow DOM** (widget da Altenar), **dashboard analítico interno** (GGR), **sites de Jogo Responsável**, os trabalhos da **MarjoSports** e o **Sentinela** (repo público, citado como "dashboard de monitoramento"). Empregador citado só como Lifters. Não citar marcas de aposta nem nomes internos de produto. Publicar só fatos de alto nível (problema, o que ele construiu, stack, decisões); nada de endpoints, credenciais, números internos ou incidentes. As fichas detalhadas ficam só na máquina do autor (fora do repositório).
- **CV em PDF:** hoje embutido em base64 no `index.html` (gerado no Google Docs).
- **Ilustração do hero:** webp embutido (dev programando à noite).
- **GitHub público:** `sentinela` (dashboard React/TypeScript de monitoramento operacional, 2026), `CRUD-Angular`, `computacao-grafica` (JS), `compiladores` (Java), repositórios acadêmicos em Java/C, README de perfil com banner e GIF do portfólio.
- **Ausências que não podem ser fabricadas:** nenhuma métrica quantitativa real (uptime, p95, volume, usuários, ganhos), nenhum depoimento, nenhuma certificação registrada. Toda visualização com cara de métrica precisa ser rotulada como demonstração/simulação.

## Product Principles

1. **Informação antes do espetáculo:** cargo, stack, experiência, contato e CV ficam acessíveis em segundos, sem depender da animação.
2. **Provar sem inventar:** o site demonstra competência; as afirmações vêm só da experiência real; demonstrações são rotuladas como tal.
3. **O site é a prova do ofício:** o acabamento de interface é o argumento, com o tom de engenharia sênior, não de truque.
4. **Encontrável e acessível:** conteúdo real no HTML, PT e EN indexáveis, reduced-motion e teclado respeitados.
5. **Feito à mão e leve:** estático, sem framework, rápido de carregar.
