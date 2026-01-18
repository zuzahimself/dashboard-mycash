# mycash+ — Documentação

## Progresso

- [x] PROMPT 0: Análise e Planejamento Inicial
- [x] PROMPT 1: Estrutura Base e Configuração
- [x] PROMPT 2: Sistema de Layout e Navegação Desktop
- [ ] PROMPT 3: Sistema de Layout e Navegação Mobile
- [ ] PROMPT 4: Context Global e Gerenciamento de Estado
- [ ] PROMPT 5: Cards de Resumo Financeiro
- [ ] PROMPT 6: Header do Dashboard com Controles
- [ ] PROMPT 7: Carrossel de Gastos por Categoria
- [ ] PROMPT 8: Gráfico de Fluxo Financeiro
- [ ] PROMPT 9: Widget de Cartões de Crédito
- [ ] PROMPT 10: Widget de Próximas Despesas
- [ ] PROMPT 11: Tabela de Transações Detalhada
- [ ] PROMPT 12: Modal de Nova Transação
- [ ] PROMPT 13: Modal de Adicionar Membro
- [ ] PROMPT 14: Modal de Adicionar Cartão
- [ ] PROMPT 15: Modal de Detalhes do Cartão
- [ ] PROMPT 16: Modal de Filtros Mobile
- [ ] PROMPT 17: View Completa de Cartões
- [ ] PROMPT 18: View Completa de Transações
- [ ] PROMPT 19: View de Perfil — Aba Informações
- [ ] PROMPT 20: View de Perfil — Aba Configurações
- [ ] PROMPT 21: Animações e Transições Globais
- [ ] PROMPT 22: Formatação e Utilitários
- [ ] PROMPT 23: Responsividade e Ajustes Finais
- [ ] PROMPT 24: Testes e Validação Final
- [ ] PROMPT FINAL: Revisão e Entrega

---

## PROMPT 0: Análise e Planejamento Inicial

**Status:** ✅ Concluído  
**Figma:** [Dashboard node 2005:2678](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2005-2678)  
**Build:** N/A (apenas planejamento)

### 1. Componentes visuais da Dashboard (página principal)

#### Hierarquia

```
App
└── Layout
    ├── Sidebar (desktop ≥1280px)
    │   ├── Logo "Mycash+"
    │   ├── Nav: Home (ativo), Cartões
    │   └── User: avatar, username, email
    ├── Main
    │   ├── Header
    │   │   ├── Search "Pesquisar"
    │   │   ├── Filter + Calendar "01 jan - 31 jan 2026"
    │   │   ├── Avatares + ícone + notificações
    │   │   └── Botão "Nova transação"
    │   ├── Cards de categorias (4): Aluguel, Alimentação, Mercado, Academia
    │   │   └── % + indicador circular + R$
    │   ├── Cards de resumo (3): Saldo total, Receitas, Despesas
    │   ├── Fluxo financeiro (gráfico de linhas/área, JAN–DEZ)
    │   ├── Cartões & Contas (lista + botão +)
    │   ├── Pagamentos (lista de despesas + botão +)
    │   └── Extrato detalhado (tabela: Membro, Data, Descrição, Categoria, Conta/Cartão, Parcelas, Valor)
    └── HeaderMobile + Drawer (<1280px, não na tela atual)
```

#### Relação entre componentes

- **Sidebar** e **Header** nunca juntos no mesmo viewport (Sidebar só ≥1280px; Header com search/filtros é do Main).
- **Main** recebe todo o conteúdo da rota (Dashboard, Cartões, Transações, Perfil).
- Cards de categorias e de resumo: reutilizáveis (Card, ProgressCircle, valor formatado).
- Fluxo financeiro, Cartões & Contas, Pagamentos e Extrato: blocos da Dashboard, depois podem virar componentes de página.

### 2. Tokens do design system (do Figma)

Fonte: `get_variable_defs` no node 2005:2678.

#### Cores (primitivas e semânticas)

| Token | Valor | Uso |
|-------|-------|-----|
| `color/brand/700` | #c4e703 | Destaque brand |
| `color/brand/600` | #d7fe03 | Brand principal |
| `color/brand/200` | #f3ffb1 | Brand claro |
| `Colors/Secondary/secondary-900` | #070A10 | Fundo escuro / sidebar |
| `Colors/Secondary/secondary-400` | #414652 | Texto secundário escuro |
| `color/neutral/1100` | #080b12 | Neutro escuro |
| `color/neutral/600` | #6b7280 | Texto secundário |
| `color/neutral/400` | #d1d5db | Borda/divisor |
| `color/neutral/300` | #e5e7eb | Borda clara |
| `color/neutral/200` | #f3f4f6 | Fundo card claro |
| `color/neutral/0` | #ffffff | Branco |
| `Colors/Surface/surface-500` | #FFFFFF | Superfície |
| `Colors/Background/background-300` | #F7F8F9 | Fundo da página |
| `Colors/Accent/Green/green-600` | #38BB82 | Positivo/sucesso |
| `color/green/500` | #44cb93 | Verde alternativo |
| `color/green/100` | #e8f9f2 | Verde fundo sucesso |
| `Colors/Accent/Red/red-600` | #D85E6D | Negativo/despesa |
| `color/red/300` | #f5a5ad | Vermelho claro |
| `icon/default` | #171719 | Ícone padrão |
| `shadow/color/brand/16` | #dffe3529 | Sombra brand |
| `shadow/color/neutral/4` | #1118270a | Sombra neutra |

#### Espaçamento (space)

| Token | Valor |
|-------|-------|
| `space/0` | 0 |
| `space/2` | 2 |
| `space/4` | 4 |
| `space/8` | 8 |
| `space/12` | 12 |
| `space/16` | 16 |
| `space/20` | 20 |
| `space/24` | 24 |
| `space/32` | 32 |
| `space/56` | 56 |

#### Shape (border-radius)

| Token | Valor |
|-------|-------|
| `shape/16` | 16 |
| `shape/100` | 100 (círculo/pill) |

#### Size (ícones/elementos)

| Token | Valor |
|-------|-------|
| `size/24` | 24 |
| `size/40` | 40 |

#### Tipografia

| Token | Estilo |
|-------|--------|
| `Heading/Medium` | Inter Bold 28px, line-height 36 |
| `Heading/XSmall` | Inter Bold 20px, line-height 28 |
| `Label/Large` | Inter Semi Bold 18px, line-height 24 |
| `Label/Medium` | Inter Semi Bold 16px, line-height 20 |
| `Label/Small` | Inter Semi Bold 14px, line-height 16 |
| `Label/XSmall` | Inter Semi Bold 12px, line-height 16 |
| `Paragraph/Medium` | Inter Regular 16px, line-height 24 |
| `Paragraph/Small` | Inter Regular 14px, line-height 20 |
| `Paragraph/XSmall` | Inter Regular 12px, line-height 20 |

### 3. Navegação

- **Sidebar (≥1280px):** expandida (texto + ícone) ou colapsada (só ícone). Empurra o Main. Home e Cartões.
- **Header do Main:** search, filtro, calendário, avatares, notificações, "Nova transação". Não é o Header Mobile.
- **Header Mobile (<1280px):** não aparece nesta tela; em outras telas: menu (drawer) + ações. Drawer com itens de navegação.
- **Transição:** troca de rota no Main; estado ativo na Sidebar (ex.: Home).

### 4. Arquitetura

#### Estrutura de pastas

```
src/
├── main.tsx
├── App.tsx
├── routes.tsx
├── components/
│   ├── layout/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── HeaderMobile.tsx
│   │   └── Main.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx
│   │   ├── CategoryCards.tsx
│   │   ├── SummaryCards.tsx
│   │   ├── FluxoFinanceiro.tsx
│   │   ├── CartoesContas.tsx
│   │   ├── Pagamentos.tsx
│   │   └── ExtratoDetalhado.tsx
│   ├── cartoes/
│   ├── transacoes/
│   └── perfil/
├── pages/
│   ├── DashboardPage.tsx
│   ├── CartoesPage.tsx
│   ├── TransacoesPage.tsx
│   └── PerfilPage.tsx
├── hooks/
├── services/
└── styles/
    ├── tokens.css
    └── global.css
```

#### Hierarquia de componentes

- **Layout:** escolhe Sidebar ou HeaderMobile + Main conforme `lg` (1280px).
- **Páginas:** apenas composição; dados via hooks/services.
- **dashboard/:** blocos da Dashboard; uso de `ui/` (Card, Button, etc.).

#### Estratégia de componentização

- Layout fluido: `width: 100%`, `max-width` quando limitar.
- Mobile-first; breakpoints `md: 768`, `lg: 1280`, `xl: 1920`.
- Variáveis: 1º semântica, 2º primitiva, 3º conversão; sem hardcode.
- Grids com `auto-fit` / `auto-fill`.

### 5. Conversões (a registrar nos próximos prompts)

- Serão documentadas aqui à medida que hex/px forem mapeados para tokens.

---

## PROMPT 1: Estrutura Base e Configuração

**Status:** ✅ Concluído  
**Build:** ✅ (1 tentativa)

### Implementado

- Projeto Vite + React + TypeScript; dependências: Tailwind, PostCSS, Autoprefixer, React Router.
- Estrutura de pastas: `components/` (layout, dashboard, cards, modals, ui), `contexts/`, `hooks/`, `types/`, `utils/`, `constants/`, `pages/`, `styles/`.
- Tailwind: breakpoints md 768, lg 1280, xl 1920; cores (brand, neutral, secondary, surface, background, green, red, icon); spacing space-0 a space-56; borderRadius shape-16, shape-100; fontSize Heading/Label/Paragraph; fontFamily Inter.
- `src/styles/tokens.css`: variáveis CSS :root com tokens do Figma (cores, space, shape, size, shadow).
- Tipos em `src/types/index.ts`: Transaction (type "income"|"expense", status, isRecurring, isPaid, etc.), Goal, CreditCard (theme "black"|"lime"|"white"), BankAccount, FamilyMember.
- React Router: 5 rotas (/ , /objetivos, /cartoes, /transacoes, /perfil) em SPA; AppLayout com nav e Outlet; páginas placeholder.
- Constantes ROUTES em `src/constants/index.ts`. Fonte Inter via Google Fonts.

### Tokens (Tailwind + tokens.css)

**Semânticos / primitivos:** brand-200/600/700, neutral-0/200/300/400/600/1100, secondary-400/900, surface-500, background-300, green-100/500/600, red-300/600, icon-default.  
**Espaçamento:** space-0, 2, 4, 8, 12, 16, 20, 24, 32, 56.  
**Shape:** shape-16, shape-100.  
**Tipografia:** text-heading-medium, text-heading-xsmall, text-label-*, text-paragraph-*.

### Arquivos

- `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`
- `tailwind.config.js`, `postcss.config.js`
- `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`
- `src/styles/tokens.css`
- `src/types/index.ts`, `src/constants/index.ts`
- `src/pages/*.tsx`, `src/pages/index.ts`
- `src/components/{layout,dashboard,cards,modals,ui}/index.ts`
- `src/contexts/index.ts`, `src/hooks/index.ts`, `src/utils/index.ts`

### Responsividade (PROMPT 1)

- **Desktop (≥1280px):** nav em linha, conteúdo com max-w-[1400px] e px-8.
- **Tablet (768–1279px):** nav com flex-wrap, px-6.
- **Mobile (&lt;768px):** nav empilhada/embrulhada, px-4. (Sidebar e Header Mobile virão nos PROMPT 2–3.)

---

## PROMPT 2: Sistema de Layout e Navegação Desktop

**Status:** ✅ Concluído  
**Figma:** Sidebar [2006:2817](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2006-2817), [2005:2698](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2005-2698)  
**Build:** ✅ (1 tentativa)

### Implementado

- **Sidebar:** dois estados (expandido 256px / colapsado 80px), altura 100vh, `bg-secondary-900`. Expandido: logo "mycash+" + ícone, nomes das seções (Home, Objetivos, Cartões, Transações, Perfil), user (avatar + username + email). Colapsado: só ícone do logo, só ícones das seções, só avatar.
- **Botão de alternância:** circular na borda direita (`-right-4`), borda `border-brand-200`, seta esquerda quando expandida e seta direita quando colapsada. `duration-300` na `width` da sidebar; o Main (flex-1) acompanha a mudança.
- **Tooltips:** quando colapsada, ao passar o mouse no item aparece tooltip à direita com o nome da seção e delay de 350ms.
- **Item ativo:** `bg-neutral-1100`, texto `text-neutral-0`, ícone `text-brand-600`. Inativos: fundo transparente, `text-neutral-600`.
- **Layout:** `useMediaQuery('(min-width: 1280px)')` para mostrar Sidebar só em ≥1280px; &lt;1280px permanece a nav superior (PROMPT 3 trocará por HeaderMobile). Sidebar empurra o conteúdo (flex); transição `transition-[width] duration-300 ease-in-out`.

### Tokens

**Cores:** secondary-900, neutral-0, neutral-600, neutral-1100, brand-200, brand-600.  
**Espaçamento:** space-4, space-8, space-12, space-16, space-24.  
**Shape:** shape-16, rounded-full.  
**Tipografia:** text-label-medium, text-paragraph-small.

### Arquivos

- `src/components/layout/Sidebar.tsx`
- `src/components/layout/index.ts`
- `src/hooks/useMediaQuery.ts`
- `src/App.tsx` (Layout com Sidebar + nav condicional)

### Responsividade (PROMPT 2)

- **Desktop (≥1280px):** Sidebar visível (expandida ou colapsada), Main ao lado. Nav superior não renderiza.
- **Tablet (&lt;1280px):** Sidebar não renderiza; nav superior + Main (comportamento provisório até PROMPT 3).
- **Mobile (&lt;1280px):** idem tablet.

---

## Sequência de prompts (a partir do 1)

| # | Nome | Escopo |
|---|------|--------|
| 1 | Estrutura Base e Configuração | Pastas (components, contexts, hooks, types, utils, constants), Tailwind com variáveis Figma, tipos (Transaction, Goal, CreditCard, BankAccount, FamilyMember), React Router (5 rotas) |
| 2 | Sistema de Layout e Navegação Desktop | Sidebar (expandido/colapsado), botão alternância, tooltips, item ativo (preto/branco/verde-limão) |
| 3 | Sistema de Layout e Navegação Mobile | HeaderMobile (&lt;1024px), MenuDropdown (avatar), "Sair", fechamento (item, X, overlay) |
| 4 | Context Global e Gerenciamento de Estado | FinanceProvider, 5 arrays, CRUD, filtros, funções derivadas, useFinance, sem localStorage, dados mock |
| 5 | Cards de Resumo Financeiro | BalanceCard, IncomeCard, ExpenseCard, animação count-up ~800ms |
| 6 | Header do Dashboard com Controles | Busca tempo real, FilterPopover / modal mobile, date range, avatares membros, "Nova Transação" |
| 7 | Carrossel de Gastos por Categoria | ExpensesByCategoryCarousel, CategoryDonutCard (donut 64px), scroll/drag/setas, gradiente bordas |
| 8 | Gráfico de Fluxo Financeiro | FinancialFlowChart (Recharts), 300px, receitas/despesas, tooltip |
| 9 | Widget de Cartões de Crédito | CreditCardsWidget, cards com % uso, hover, modal detalhes, paginação |
| 10 | Widget de Próximas Despesas | Lista despesas pendentes, ordenar por vencimento, check (marcar pago, recorrente, parcelas) |
| 11 | Tabela de Transações Detalhada | TransactionsTable: 7 colunas, zebra, filtros combinados, paginação 5/página |
| 12 | Modal de Nova Transação | Fullscreen, toggle tipo, campos (valor, descrição, categoria, membro, conta/cartão, parcelamento, recorrente), validação |
| 13 | Modal de Adicionar Membro | AddMemberModal: nome, função, avatar (URL/Upload), renda opcional |
| 14 | Modal de Adicionar Cartão | Toggle conta/cartão, campos condicionais, tema (Black/Lime/White) |
| 15 | Modal de Detalhes do Cartão | CardDetailsModal: info, uso, tabela despesas do cartão, ações |
| 16 | Modal de Filtros Mobile | FiltersMobileModal: slide-in de baixo, tipo/membro/período, "Aplicar Filtros" |
| 17 | View Completa de Cartões | CardsView: grid 1/2/3 col, cards detalhados, empty |
| 18 | View Completa de Transações | TransactionsView: filtros avançados, resumo, TransactionsTable expandido, exportar |
| 19 | View de Perfil — Aba Informações | ProfileView: perfil, membros da família, "Sair" |
| 20 | View de Perfil — Aba Configurações | Preferências, notificações, categorias, dados/privacidade, sobre |
| 21 | Animações e Transições Globais | Navegação, cards, hover, count-up, modais, toasts, skeletons, prefers-reduced-motion |
| 22 | Formatação e Utilitários | Moeda, datas, arrays, cálculos, validação, generateUniqueId, JSDoc, testes |
| 23 | Responsividade e Ajustes Finais | Mobile-first, 768/1280/1920, sidebar/header mobile, grids, touch, a11y |
| 24 | Testes e Validação Final | Fluxo usuário, cálculos, filtros, formatações, responsividade, modais, a11y, performance, README |
| FINAL | Revisão e Entrega | Checklist, código, comentários, performance, TODOs Supabase, documentação, relatório final |

---

## Padrão de commits

- `feat:` nova funcionalidade
- `fix:` correção
- `docs:` documentação
- `refactor:` refatoração

## Comandos

- **Próximo** → próximo prompt
- **Revisar [arquivo]** → revisar arquivo
- **Refazer** → refazer prompt
- **Status** → progresso
- **Tokens** → conversões
