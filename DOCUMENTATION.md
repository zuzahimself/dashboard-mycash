# mycash+ — Documentação

## Progresso

- [x] PROMPT 0: Análise e Planejamento Inicial
- [x] PROMPT 1: Estrutura Base e Configuração
- [x] PROMPT 2: Sistema de Layout e Navegação Desktop
- [x] PROMPT 3: Sistema de Layout e Navegação Mobile
- [x] PROMPT 4: Context Global e Gerenciamento de Estado
- [x] PROMPT 5: Cards de Resumo Financeiro
- [x] PROMPT 6: Header do Dashboard com Controles
- [x] PROMPT 7: Carrossel de Gastos por Categoria
- [x] PROMPT 8: Gráfico de Fluxo Financeiro
- [x] PROMPT 9: Widget de Cartões de Crédito
- [x] PROMPT 10: Widget de Próximas Despesas
- [x] PROMPT 11: Tabela de Transações Detalhada
- [x] PROMPT 12: Modal de Nova Transação
- [x] PROMPT 13: Modal de Adicionar Membro
- [x] PROMPT 14: Modal de Adicionar Cartão
- [x] PROMPT 15: Modal de Detalhes do Cartão
- [x] PROMPT 16: Modal de Filtros Mobile
- [x] PROMPT 17: View Completa de Cartões
- [x] PROMPT 18: View Completa de Transações
- [x] PROMPT 19: View de Perfil — Aba Informações
- [x] PROMPT 20: View de Perfil — Aba Configurações
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
- **Tablet (&lt;1280px):** Sidebar não renderiza; HeaderMobile + MenuDropdown (PROMPT 3).
- **Mobile (&lt;1280px):** idem tablet.

---

## PROMPT 3: Sistema de Layout e Navegação Mobile

**Status:** ✅ Concluído  
**Figma:** [2005:2678](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2005-2678)  
**Build:** ✅

### Implementado

- **HeaderMobile:** fixo no topo (`fixed`), largura total, logo "Mycash+" à esquerda, avatar à direita. Visível em &lt;1024px (`useMediaQuery('(min-width: 1024px)')`). Avatar é trigger do MenuDropdown.
- **MenuDropdown:** desliza de cima para baixo (animação), overlay escuro. Itens: Home, Objetivos, Cartões, Transações, Perfil (NavLink), botão "Sair" vermelho. Fechamento: clique em item, X, overlay. `animate-slide-up` e transições.
- **App:** Sidebar só ≥1024px; HeaderMobile e `pt-14` no main quando &lt;1024px. Nunca os dois juntos.

### Arquivos

- `src/components/layout/HeaderMobile.tsx`
- `src/components/layout/MenuDropdown.tsx`
- `src/components/layout/index.ts`
- `src/App.tsx`
- `src/index.css` (`@keyframes slideUp`, `.animate-slide-up`)

---

## PROMPT 4: Context Global e Gerenciamento de Estado

**Status:** ✅ Concluído  
**Build:** ✅

### Implementado

- **FinanceProvider:** em `main.tsx`; 5 arrays: `transactions`, `goals`, `creditCards`, `bankAccounts`, `familyMembers`. CRUD para cada entidade.
- **Filtros globais:** `selectedMember`, `dateRange` (startDate/endDate), `transactionType` ("all"|"income"|"expense"), `searchText`.
- **Funções derivadas (aplicam filtros):** `getFilteredTransactions`, `calculateTotalBalance`, `calculateIncomeForPeriod`, `calculateExpensesForPeriod`, `calculateExpensesByCategory`, `getBalanceGrowthPercent` (mock).
- **useFinance:** único ponto de acesso ao contexto. Sem localStorage/sessionStorage; dados em memória (useState).

### Dados mock

- Três membros da família, cartões (Nubank, Itaú, Bradesco, etc.), transações (incl. `isPaid: false` para Próximas despesas), objetivos, categorias brasileiras.

### Arquivos

- `src/contexts/FinanceContext.tsx`
- `src/contexts/index.ts`
- `src/main.tsx` (wrap em FinanceProvider)
- `src/types/index.ts` (Transaction, Goal, CreditCard, BankAccount, FamilyMember)

---

## PROMPT 5: Cards de Resumo Financeiro

**Status:** ✅ Concluído  
**Figma:** [2012:2991](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2012-2991), [2006:6612](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2006-6612)  
**Build:** ✅

### Implementado

- **SummaryCard:** estrutura unificada (Figma 2012-2991): ícone no topo, **Content** (título + valor com `gap-space-8`); `justify-between` para o espaço entre ícone e Content. `p-space-24`, `rounded-shape-16`, `border`, `bg-surface-500`. `h-full`, `flex-[1_0_0]`, `self-stretch` quando em grid com `items-stretch`.
- **BalanceCard:** ícone $ (neutral), "Saldo total", `calculateTotalBalance`.
- **IncomeCard:** ícone tendência alta (green-100/green-600), "Receitas", `calculateIncomeForPeriod`.
- **ExpenseCard:** ícone tendência baixa (red-300/red-600), "Despesas", `calculateExpensesForPeriod`.
- **SummaryCards:** grid `md:grid-cols-[2fr_1fr_1fr]`, `flex-1` `min-h-0` `grid-rows-[1fr]` para preencher altura (items-stretch na Dashboard). Mobile: 1 coluna.
- **useCountUp:** animação de contagem nos valores (~800ms ease-out).

### Arquivos

- `src/components/dashboard/SummaryCard.tsx`
- `src/components/dashboard/BalanceCard.tsx`
- `src/components/dashboard/IncomeCard.tsx`
- `src/components/dashboard/ExpenseCard.tsx`
- `src/components/dashboard/SummaryCards.tsx`
- `src/hooks/useCountUp.ts`
- `src/components/dashboard/index.ts`

---

## PROMPT 6: Header do Dashboard com Controles

**Status:** ✅ Concluído  
**Figma:** [2006:6654](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2006-6654), [2005:2678](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2005-2678)  
**Build:** ✅

### Implementado

- **DashboardHeader:** busca ("Pesquisar...") em tempo real → `searchText`; case-insensitive em descrição e categoria.
- **Filtros:** botão ícone; desktop: FilterPopover (tipo: Todos, Receitas, Despesas); mobile: FiltersMobileModal (PROMPT 16; slide-in de baixo, tipo + membro + período, "Aplicar Filtros").
- **Seletor de período:** "01 jan - 31 jan, 2024"; desktop: 2 meses lado a lado; mobile: 1 mês com setas. Atalhos: Este mês, Mês passado, Últimos 3 meses, Este ano. Atualiza `dateRange`.
- **Membros da família:** avatares sobrepostos, clique para filtrar (borda preta/check), botão "+" abre AddMemberModal (ver PROMPT 13: nome, função, avatar opcional, renda). Validação e `addFamilyMember`; `onMemberAdded` para toast.
- **"Nova Transação":** botão preto, ícone "+"; mobile: largura total, altura maior.

### Arquivos

- `src/components/dashboard/DashboardHeader.tsx` (FilterContent, PeriodPicker, import AddMemberModal, import FiltersMobileModal para mobile)
- `src/components/dashboard/index.ts`

---

## PROMPT 7: Carrossel de Gastos por Categoria

**Status:** ✅ Concluído  
**Figma:** [2006:6612](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2006-6612), [2005:2678](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2005-2678)  
**Build:** ✅

### Implementado

- **ExpensesByCategoryCarousel:** `calculateExpensesByCategory`, `calculateIncomeForPeriod`; % em relação à receita. Scroll horizontal (wheel, drag, touch). Setas flutuantes no hover (desktop), delay para evitar flicker; gradiente de fade nas bordas; `isAtStart` para ocultar fade à esquerda no início.
- **CategoryDonutCard:** 160px, donut (anel colorido, % no centro), nome da categoria, valor. `CATEGORY_RING_COLORS`. Hover: borda `brand-600`.

### Arquivos

- `src/components/dashboard/ExpensesByCategoryCarousel.tsx`
- `src/components/dashboard/CategoryDonutCard.tsx`
- `src/components/dashboard/index.ts`

---

## PROMPT 8: Gráfico de Fluxo Financeiro

**Status:** ✅ Concluído  
**Figma:** [2008:677](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2008-677), [2005:2678](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2005-2678)  
**Build:** ✅

### Implementado

- **FinancialFlowChart (Recharts):** título "Fluxo Financeiro" + ícone, legenda (Receitas verde-limão, Despesas preto). AreaChart: X (meses abreviados), Y (R$ 2k, 4k…), grid horizontal tracejado. Duas Area: Receitas (borda brand-600, gradiente) e Despesas (borda secondary-900, gradiente). CustomTooltip com linha vertical. Dados mock 7 meses; estrutura para agregação futura.
- **Altura:** `flex-1` + `minHeight: 300` para igualar à altura do card Próximas despesas (`items-stretch` na grid). `h-full` no article.

### Arquivos

- `src/components/dashboard/FinancialFlowChart.tsx`
- `src/components/dashboard/index.ts`

---

## PROMPT 9: Widget de Cartões de Crédito

**Status:** ✅ Concluído  
**Figma:** [2006:6816](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2006-6816), [2005:2678](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2005-2678)  
**Build:** ✅

### Implementado

- **CreditCardsWidget:** fundo branco, borda, header "Cartões & Contas", ícone, botão "+" (AddAccountCardModal desde PROMPT 14), setas de paginação no header (&gt;3 cartões). Lista: ícone 16px + nome do banco, fatura atual, "Vence dia DD", "•••• {lastDigits}". `border-b` entre itens, `hover:bg-neutral-200/50`. Clique: CardDetailsModal (componente extraído em PROMPT 15). Props: `onAccountCardAdded`, `onAddExpense`.
- **AddAccountCardModal (PROMPT 14):** substitui NewCardModal; toggle Conta/Cartão, temas. **CardDetailsModal (PROMPT 15):** componente em arquivo próprio; grid infos, barra de uso, tabela despesas, Ver Extrato, Adicionar Despesa, Editar, Fechar.

### Arquivos

- `src/components/dashboard/CreditCardsWidget.tsx` (usa AddAccountCardModal, CardDetailsModal importado)
- `src/components/dashboard/index.ts`

---

## PROMPT 10: Widget de Próximas Despesas

**Status:** ✅ Concluído  
**Figma:** [2005:2678](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2005-2678)  
**Build:** ✅

### Implementado

- **UpcomingExpensesWidget:** fundo branco, header "Próximas despesas", ícone carteira, botão "+" (NewTransactionModal). Lista de `type === 'expense'` e `!isPaid`, ordenada por data. Cada item: descrição, "Vence dia DD/MM", conta/cartão, valor, botão check (32px). Check: `updateTransaction` (isPaid), animação de saída; se `isRecurring`, `addTransaction` com `date: getNextRecurrenceDate(t.date)`; toast "Despesa marcada como paga!". Estado vazio: ícone check verde, "Nenhuma despesa pendente", borda tracejada.
- **NewTransactionModal:** campos para nova despesa (descrição, valor, vencimento, conta/cartão, categoria); `addTransaction` com `type: 'expense'`, `isPaid: false`.

### Arquivos

- `src/components/dashboard/UpcomingExpensesWidget.tsx` (ExpenseRow, NewTransactionModal)
- `src/contexts/FinanceContext.tsx` (getNextRecurrenceDate, mocks `isPaid: false`)
- `src/components/dashboard/index.ts`

---

## PROMPT 11: Tabela de Transações Detalhada

**Status:** ✅ Concluído  
**Figma:** [2005:2678](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2005-2678)  
**Build:** ✅

### Implementado

- **TransactionsTable:** header "Extrato Detalhado", busca local, select tipo (Todos/Receitas/Despesas). Tabela 7 colunas: Membro (avatar/inicial 24px), Data, Descrição (ícone+texto), Categoria (badge), Conta/Cartão, Parcelas, Valor. Zebra, hover. Filtros combinados (globais + localSearch, localType). Ordenação por data desc. Paginação 5/página, "Mostrando X a Y de Z", Anterior/números/Próxima; scroll suave ao trocar página. Empty: "Nenhum lançamento encontrado."

### Arquivos

- `src/components/dashboard/TransactionsTable.tsx`
- `src/index.css` (`@keyframes fadeIn`, `.animate-fade-in`)

---

## PROMPT 12: Modal de Nova Transação

**Status:** ✅ Concluído  
**Build:** ✅ (wireframes Figma 0:3311, 0:3645, 0:3572, 0:3722)

### Implementado

- **NewTransactionModalFull:** fullscreen, header fixo (ícone 64px, "Nova Transação", X 48px). Toggle Receita | Despesa. Campos: Valor (R$, 56px), Descrição (min 3), Categoria (select + "Nova Categoria"), Membro, Conta/Cartão (optgroup), Data, Parcelamento (1–12x, só despesa+cartão; desliga se recorrente), Recorrente (só despesa; desliga se parcelas &gt;1). Validação; `addTransaction`; toast. Conteúdo centralizado (`max-w-xl`), inputs `bg-surface-500`. Prop **initialAccountId** para pré-preencher ao abrir de "Adicionar Despesa" (CardDetailsModal).

### Arquivos

- `src/components/dashboard/NewTransactionModalFull.tsx`
- `src/pages/DashboardPage.tsx` (estado, toast, integração)

---

## PROMPT 13: Modal de Adicionar Membro

**Status:** ✅ Concluído  
**Build:** ✅ (wireframe Figma 0:3532)

### Implementado

- **AddMemberModal** (extraído do DashboardHeader): overlay, modal centralizado. Header "Adicionar Membro da Família", X. Campos: Nome completo (obrigatório, min 3), Função na família (obrigatório, select: Pai, Mãe, Filho, Filha, Avô, Avó, Tio, Tia), Avatar opcional (abas **URL** e **Upload** — JPG/PNG, máx 5MB; validação de tipo/tamanho), Renda mensal (opcional, moeda pt-BR). Footer: Cancelar, "Adicionar Membro". Validação; `addFamilyMember`; toast "Membro adicionado com sucesso!". DashboardHeader passa `onMemberAdded`; DashboardPage exibe o toast.

### Arquivos

- `src/components/dashboard/AddMemberModal.tsx` (export `AddMemberFormData`)
- `src/components/dashboard/DashboardHeader.tsx` (import, `onMemberAdded`)
- `src/pages/DashboardPage.tsx` (`onMemberAdded` → setToast)
- `src/components/dashboard/index.ts`

---

## PROMPT 14: Modal de Adicionar Conta/Cartão

**Status:** ✅ Concluído  
**Build:** ✅

### Implementado

- **AddAccountCardModal:** modal 500–600px (90% mobile), overlay. Header "Adicionar Conta/Cartão", X. Toggle **Conta Bancária** | **Cartão de Crédito** (selecionado preto/branco). Campos comuns: Nome (obrigatório, min 3; label por tipo), Titular (select membros). **Conta:** Saldo inicial (moeda). **Cartão:** Dia fechamento/vencimento (1–31), Limite total (&gt;0), Últimos 4 dígitos (opcional, exatamente 4), **Tema visual** (3 cards clicáveis Black, Lime, White; selecionado borda azul). Validação por tipo; `addBankAccount` ou `addCreditCard` (currentBill 0 em cartão novo); toast "Conta/Cartão adicionado com sucesso!". **CreditCardsWidget:** substitui NewCardModal por AddAccountCardModal; `onAccountCardAdded`, `onAddExpense`; integração em DashboardPage e CartoesPage.

### Arquivos

- `src/components/dashboard/AddAccountCardModal.tsx`
- `src/components/dashboard/CreditCardsWidget.tsx` (remove NewCardModal)
- `src/components/dashboard/index.ts`
- `src/pages/DashboardPage.tsx` (toast, onAccountCardAdded)

---

## PROMPT 15: Modal de Detalhes do Cartão

**Status:** ✅ Concluído  
**Build:** ✅

### Implementado

- **CardDetailsModal** (extraído para `CardDetailsModal.tsx`): modal maior. Header: nome do cartão, X. **Área informações:** grid 2–3 col (1 mobile): Limite total, Fatura atual, Limite disponível, % uso, Dia fechamento/vencimento, •••• 1234. Cada um em card (label cinza, valor negrito). **Barra de progresso** do uso (vermelha). **Tabela de despesas:** `type=expense` e `accountId=cartão`; colunas Data, Descrição, Categoria, Parcelas, Valor; paginação 10/pg; empty "Nenhuma despesa registrada neste cartão ainda." **Botões:** "Ver Extrato Completo" (navega `/transacoes` com `state.accountId`), "Adicionar Despesa" (abre NewTransactionModalFull com `initialAccountId`), "Editar Cartão" (por enquanto fecha), "Fechar". Usado em CreditCardsWidget e em CardsView.

### Arquivos

- `src/components/dashboard/CardDetailsModal.tsx`
- `src/components/dashboard/CreditCardsWidget.tsx` (import, `onAddExpense`, `onEditCard`)
- `src/components/dashboard/NewTransactionModalFull.tsx` (prop `initialAccountId`)
- `src/pages/DashboardPage.tsx` (`addExpenseForAccountId`, onAddExpense → CreditCardsWidget)
- `src/components/dashboard/index.ts`

---

## PROMPT 16: Modal de Filtros Mobile

**Status:** ✅ Concluído  
**Build:** ✅

### Implementado

- **FiltersMobileModal:** abre ao tocar no botão de filtros no header (mobile). **Entrada:** slide-in de baixo (`translateY 100%` → 0, 300ms `animate-slide-up`). **Fechamento:** "Aplicar Filtros" → copia estado para contexto (`transactionType`, `selectedMember`, `dateRange`) e slide-out (`animate-slide-down` 300ms); X ou overlay → fecha sem aplicar. Header fixo: "Filtros", X (área toque ≥44x44). Conteúdo scrollável: **Tipo de Transação** (grid 3 col, 48px: Todos, Receitas, Despesas; selecionado preto/branco); **Membro da Família** (Todos + pills com avatar 32px e nome, 48px; selecionado preto); **Período** (calendário 1 mês, setas, seleção de intervalo). Footer: botão "Aplicar Filtros" (56px, preto, largura total). Estado temporário no componente; ao aplicar, `setTransactionType`, `setSelectedMember`, `setDateRange`. **DashboardHeader:** em mobile, FilterModal substituído por FiltersMobileModal.

### Arquivos

- `src/components/dashboard/FiltersMobileModal.tsx`
- `src/components/dashboard/DashboardHeader.tsx` (import, troca FilterModal)
- `src/index.css` (`@keyframes slideDown`, `.animate-slide-down`)

---

## PROMPT 17: View Completa de Cartões

**Status:** ✅ Concluído  
**Build:** ✅

### Implementado

- **CardsView** em **CartoesPage:** header "Cartões de Crédito", select ordenar (fatura decrescente ou alfabética), botão "Novo Cartão" (preto, +). Grid: mobile 1 col, tablet 2, desktop 3. Cada **card:** nome em negrito, ícone tema, •••• 1234; limites, fatura, disponível, % uso; barra de progresso; datas fechamento/vencimento; botões "Ver Detalhes", "Adicionar Despesa". Hover: card eleva e sombra. Clique no card abre CardDetailsModal. **Empty:** ícone cartão cinza, "Nenhum cartão cadastrado", "Cadastrar Primeiro Cartão". AddAccountCardModal e CardDetailsModal internos; `onAddExpense` e `onAccountCardAdded` repassados pela página. **CartoesPage:** NewTransactionModalFull para "Adicionar Despesa", toast.

### Arquivos

- `src/components/dashboard/CardsView.tsx`
- `src/pages/CartoesPage.tsx`
- `src/components/dashboard/index.ts`

---

## PROMPT 18: View Completa de Transações

**Status:** ✅ Concluído  
**Build:** ✅

### Implementado

- **TransactionsView** em **TransacoesPage:** header "Transações", "Nova Transação". **Barra de filtros** (horizontal desktop, wrap mobile): busca, tipo, categoria, conta/cartão, membro, período (date start/end), status (Todos, Concluído, Pendente). AND com filtros globais (`getFilteredTransactions` + filtros locais). **Linha de resumo:** total receitas, total despesas, diferença (verde/vermelho), quantidade de transações. **Tabela:** 10/página, ordenação clicável em Data e Valor (seta ↑/↓), **Exportar CSV** (download). Empty: "Nenhuma transação registrada ainda" + botão "Nova Transação". `location.state?.accountId` (vindo de "Ver Extrato" do CardDetailsModal) pré-preenche filtro de conta. NewTransactionModalFull na página.

### Arquivos

- `src/components/dashboard/TransactionsView.tsx`
- `src/pages/TransacoesPage.tsx`
- `src/components/dashboard/index.ts`

---

## PROMPT 19: View de Perfil — Aba Informações

**Status:** ✅ Concluído  
**Build:** ✅

### Implementado

- **PerfilPage** com abas **"Informações"** e **"Configurações"**; ao entrar, Informações ativa. Abas com borda inferior na ativa. **Aba Informações:** **Card de perfil:** avatar 120px, nome, função, email, renda formatada; botão "Editar Perfil". **Card "Membros da Família":** lista (avatar 48px, nome, função, renda; fundo cinza claro; hover; clicável). Se só um membro: mensagem + "Adicionar Membro da Família"; senão, lista + botão "Adicionar Membro da Família". **AddMemberModal** integrado; toast ao adicionar. **Botão "Sair"** vermelho com ícone logout. Dados: `familyMembers[0]` como usuário principal.

### Arquivos

- `src/pages/PerfilPage.tsx`
- `src/components/dashboard/AddMemberModal.tsx` (reutilizado)

---

## PROMPT 20: View de Perfil — Aba Configurações

**Status:** ✅ Concluído  
**Build:** ✅

### Implementado

- **Aba Configurações** em PerfilPage. **Preferências de Exibição:** toggle "Modo Escuro" (desabilitado, "Em breve"), select moeda "Real (R$)", select data "DD/MM/AAAA". **Notificações:** toggles (lembrete vencimento, alerta limite, resumo e-mail, objetivos alcançados) — estado visual local. **Gerenciar Categorias:** Receita e Despesa com listas (Salário, Alimentação, etc.), "Adicionar Categoria". **Dados e Privacidade:** "Exportar JSON" e "Exportar CSV" (dados do contexto: transactions, goals, creditCards, bankAccounts, familyMembers); "Limpar Todos os Dados" (vermelho, confirmação em 2 cliques), texto "Esta ação não pode ser desfeita". **FinanceContext:** `clearAllData` (limpa arrays e filtros). **Sobre o mycash+:** versão "v1.0.0", descrição, links Termos e Política. Layout: cards verticais; desktop alguns em 2 colunas (`md:grid-cols-2`).

### Arquivos

- `src/pages/PerfilPage.tsx`
- `src/contexts/FinanceContext.tsx` (`clearAllData`)

---

## Ajustes e refinamentos (pós-prompts)

- **Sidebar:** `position: fixed`, `z-20`; `marginLeft` no App conforme `SIDEBAR_WIDTH_EXPANDED`/`SIDEBAR_WIDTH_COLLAPSED`; logos `/logo-full.svg`, `/logo-icon.svg` em `public/`.
- **DashboardPage:** layout em 2 grids: (1) Carousel + SummaryCards | CreditCardsWidget; (2) FinancialFlowChart | UpcomingExpensesWidget. `items-stretch` em ambas; `pb-8` no main. Coluna esquerda com `min-h-0` e `flex-1` em SummaryCards para preencher altura.
- **FinancialFlowChart / UpcomingExpensesWidget:** `h-full` para mesma altura entre os dois cards.
- **Sessão PROMPT 13–20:** AddMemberModal extraído (avatar URL/Upload; PROMPT 6 passou a usá-lo via import). CreditCardsWidget: NewCardModal substituído por AddAccountCardModal; CardDetailsModal extraído para `CardDetailsModal.tsx` e reutilizado em CardsView. DashboardHeader (mobile): FilterModal trocado por FiltersMobileModal. NewTransactionModalFull: prop `initialAccountId` para "Adicionar Despesa" a partir do CardDetails. FinanceContext: `clearAllData` para Perfil → Configurações.

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
