# Sequência de prompts — mycash+

Fonte: [Sequência de Prompts (Google Docs)](https://docs.google.com/document/d/1s-KKXi3hROSBsgfxXOKpeMOxD318U7z9hSJ0UiIRT4Q/edit?tab=t.0)  
Complemento: alinhado ao Figma [Dashboard 2005:2678](https://www.figma.com/design/y5QghxUMSRQwBggcYYpzgh/Workshop---Do-figma-MCP-ao-Cursor-AI-v.2--Community-?node-id=2005-2678) e às regras em `.cursor/skills/regras-figma/SKILL.md`.

---

## Notas

> **Breakpoints:** Os prompts 1–3 citam 1024px (desktop) e 640/641px (mobile/tablet). O PROMPT 23 e as regras-figma usam 768 / 1280 / 1920. Na implementação, priorizar **768 / 1280 / 1920** (regras-figma e PROMPT 23) para manter consistência com o resto do projeto.
>
> **Rotas:** Dashboard (/), Objetivos (/objetivos), Cartões (/cartoes), Transações (/transacoes), Perfil (/perfil).

---

## PROMPT 0: Análise e Planejamento Inicial ✅

- Acessar Figma (MCP) e mapear componentes: Dashboard, Cartões, Transações, Perfil.
- Mapear variáveis semânticas e primitivas (cor, espaçamento, tipografia, shape).
- Analisar navegação: Sidebar (expandida/colapsada), Header Mobile, transições.
- Resumir arquitetura: pastas, hierarquia de componentes, estratégia de componentização.
- **Entrega:** DOCUMENTATION.md (e este arquivo). Sem código.

---

## PROMPT 1: Estrutura Base e Configuração

Cursor, agora vamos criar a estrutura base do projeto:

- Configure a estrutura de pastas seguindo boas práticas de arquitetura React. Crie diretórios separados para componentes, contexts, hooks, types, utils e constants. Dentro de components, organize subpastas por domínio: layout (sidebar, header), dashboard, cards, modals, etc.
- Configure o Tailwind CSS para reconhecer e utilizar as variables do Figma como classes customizadas. Garanta que todos os tokens semânticos e primitivos estejam mapeados corretamente no arquivo de configuração do Tailwind.
- Crie os tipos TypeScript fundamentais que representam as cinco entidades principais do sistema: Transaction, Goal, CreditCard, BankAccount e FamilyMember. Cada tipo deve conter todos os campos descritos na documentação, com tipagens precisas incluindo tipos de união onde apropriado (exemplo: tipo de transação sendo "income" ou "expense").
- Configure o React Router para gerenciar as cinco rotas principais do sistema, mantendo o conceito de single page application onde apenas o conteúdo central muda enquanto a estrutura de navegação permanece visível.

**Requisitos de Responsividade:**
- Desktop (≥1024px): [comportamento]
- Tablet (641-1023px): [comportamento]
- Mobile (≤640px): [comportamento]

---

## PROMPT 2: Sistema de Layout e Navegação Desktop

Cursor, vamos implementar o sistema de navegação desktop com a sidebar:

- Crie o componente Sidebar que ocupa o lado esquerdo da tela com altura total do viewport. Este componente deve ter dois estados visuais distintos: expandido e colapsado. No estado expandido, mostre o logotipo completo "mycash+", os nomes das seções e as informações completas do perfil do usuário. No estado colapsado, mostre apenas o ícone do logotipo, ícones das seções e apenas o avatar do perfil.
- Implemente a lógica de alternância entre estados através de um botão circular posicionado na borda direita da sidebar. O ícone dentro do botão deve mudar de acordo com o estado atual: seta para esquerda quando expandida, seta para direita quando colapsada.
- Configure as transições suaves entre os dois estados. Quando a sidebar expande ou colapsa, o conteúdo principal à direita deve ajustar sua margem esquerda de forma fluida e animada. Todas as transições devem ter duração adequada para serem perceptíveis mas não lentas.
- Implemente o sistema de tooltip que aparece ao passar o mouse sobre itens de navegação quando a sidebar está colapsada. O tooltip deve aparecer ao lado direito do item com leve delay e conter o nome completo da seção.
- Adicione o comportamento de item ativo: o item de navegação correspondente à seção atual deve ter fundo preto com texto branco e ícone verde-limão. Itens inativos devem ter fundo transparente com texto cinza.
- Utilize exclusivamente as variables do design system do Figma para todas as cores, espaçamentos, tamanhos de fonte e raios de borda. Priorize sempre tokens semânticos e, quando não disponíveis, utilize tokens primitivos.

**Requisitos de Responsividade:**
- Desktop (≥1024px): [comportamento]
- Tablet (641-1023px): [comportamento]
- Mobile (≤640px): [comportamento]

---

## PROMPT 3: Sistema de Layout e Navegação Mobile

Cursor, agora vamos criar a versão mobile da navegação:

- Implemente o componente HeaderMobile que substitui completamente a sidebar em viewports menores que 1024 pixels. Este header deve ser fixo no topo, ocupar largura total e permanecer visível mesmo durante scroll.
- O header deve conter o logotipo "mycash+" à esquerda em tamanho apropriado para mobile e o avatar do usuário à direita. O avatar deve ser clicável e funcionar como trigger para o menu dropdown.
- Crie o componente MenuDropdown que aparece quando o avatar é tocado. Este menu deve deslizar de cima para baixo com animação suave e cobrir o conteúdo abaixo sem ocupar a tela inteira (não é fullscreen).
- Dentro do dropdown, liste todos os itens de navegação com ícone e texto. O item da seção atual deve aparecer destacado com fundo preto. Adicione um botão vermelho "Sair" na parte inferior do menu para logout.
- Implemente a lógica de fechamento do menu: deve fechar ao clicar em qualquer item de navegação, ao clicar no botão X no canto superior direito do menu, ou ao clicar/tocar fora da área do menu no overlay escuro semi-transparente.
- Configure os breakpoints corretamente para que em desktop (acima de 1024px) apenas a sidebar apareça, e em mobile/tablet (abaixo de 1024px) apenas o header apareça. Nunca devem aparecer simultaneamente.
- Utilize as variables do design system para todos os estilos visuais, respeitando a hierarquia de tokens semânticos primeiro, primitivos depois.

**Requisitos de Responsividade:**
- Desktop (≥1024px): [comportamento]
- Tablet (641-1023px): [comportamento]
- Mobile (≤640px): [comportamento]

---

## PROMPT 4: Context Global e Gerenciamento de Estado

**REGRA CRÍTICA DE ARMAZENAMENTO:** Este sistema NÃO suporta localStorage, sessionStorage ou qualquer browser storage API. TODO o estado deve ser gerenciado EXCLUSIVAMENTE via React state (useState, useReducer). Os dados são temporários e existem apenas durante a sessão do navegador. Futuramente, integraremos com Supabase para persistência real.

Cursor, vamos criar o coração do sistema - o gerenciamento de estado global:

- Crie um Context Provider chamado FinanceProvider que vai armazenar e gerenciar todo o estado da aplicação. Este provider deve ser colocado no nível mais alto da árvore de componentes para que todos possam acessá-lo.
- Dentro deste context, mantenha os cinco arrays principais: transactions, goals, creditCards, bankAccounts e familyMembers. Cada array deve ser tipado corretamente com os tipos TypeScript que você criou anteriormente.
- Implemente as funções CRUD básicas para cada entidade: adicionar novo item, atualizar item existente, deletar item. Estas funções devem atualizar os arrays no estado e, consequentemente, causar re-renderização de todos os componentes que dependem desses dados.
- Crie um segundo conjunto de estados para os filtros globais: selectedMember (ID do membro ou null), dateRange (objeto com startDate e endDate), transactionType (string podendo ser "all", "income" ou "expense"), e searchText (string para busca textual).
- Implemente funções de cálculo derivadas que outros componentes vão consumir. Estas funções devem aplicar automaticamente todos os filtros ativos antes de calcular: getFilteredTransactions, calculateTotalBalance, calculateIncomeForPeriod, calculateExpensesForPeriod, calculateExpensesByCategory, calculateCategoryPercentage, calculateSavingsRate.
- Crie um hook customizado useFinance que encapsula o useContext e fornece acesso limpo a todo o estado e funções. Este hook deve ser o único ponto de acesso ao contexto em toda a aplicação.
- Popule o estado inicial com dados mock realistas: três membros da família brasileira, três cartões de bancos conhecidos, vinte a trinta transações distribuídas nos últimos três meses, quatro objetivos variados, e categorias padrão brasileiras.

**NÃO use localStorage, sessionStorage ou qualquer browser storage API. Use apenas React state (useState, useReducer) para armazenamento em memória.**

---

## PROMPT 5: Cards de Resumo Financeiro

Cursor, vamos criar os três cards de resumo que aparecem no topo do dashboard:

- Implemente o componente BalanceCard (Card de Saldo Total) com fundo completamente preto e texto branco. Destaque visual: círculo grande desfocado (blur intenso) na cor verde-limão com opacidade baixa, parcialmente cortado pelas bordas do card. Label "Saldo Total", valor do saldo formatado como moeda brasileira. Badge arredondado com fundo semi-transparente branco contendo ícone de gráfico crescente e texto de crescimento percentual vs mês anterior (ex: "+12% esse mês"). Valor de calculateTotalBalance do contexto.
- Crie IncomeCard (fundo branco, borda sutil): label "Receitas", círculo com ícone de seta diagonal baixo-esquerda, valor de calculateIncomeForPeriod.
- Crie ExpenseCard (estrutura similar): label "Despesas" em cinza médio, ícone em círculo com fundo vermelho claro (seta cima-direita), valor de calculateExpensesForPeriod.
- Organize os três cards horizontalmente no desktop e verticalmente no mobile. Card de saldo pode ser um pouco maior no desktop.
- Implemente animações suaves de contagem nos valores: quando um valor muda, anime de zero até o valor final em ~800ms.

Siga rigorosamente a hierarquia de variáveis das Project Rules.

---

## PROMPT 6: Header do Dashboard com Controles

Cursor, vamos implementar a barra de controles no topo do dashboard:

- Crie o componente DashboardHeader com campo de busca à esquerda (placeholder "Pesquisar...", ícone de lupa). Busca em tempo real: a cada caractere digitado, atualize searchText no contexto. Case-insensitive, correspondências em descrição OU categoria.
- Botão de filtros (ícone de controles deslizantes): no desktop abre FilterPopover (fundo branco semi-transparente, backdrop blur) com seção "Tipo de Transação" (rádio: Todos, Receitas, Despesas). No mobile abre modal fullscreen que desliza de baixo para cima.
- Seletor de período: botão com período formatado "01 jan - 31 jan, 2024". Ao clicar, calendário interativo (desktop: dois meses lado a lado; mobile: um mês com setas). Seleção de intervalo (primeiro clique início, segundo fim). Atalhos: "Este mês", "Mês passado", "Últimos 3 meses", "Este ano". Ao confirmar, atualize dateRange no contexto.
- Widget de membros da família: avatares circulares parcialmente sobrepostos (pilha), borda branca. Hover: avatar cresce. Clique: aplica filtro de membro (borda preta, ícone check); clicar novamente remove. Botão "+" após avatares abre modal adicionar membro.
- Botão "Nova Transação" (canto direito): fundo preto, texto branco, ícone "+". No mobile: largura total, altura maior para toque.

Utilize as variables do design system rigorosamente.

---

## PROMPT 7: Carrossel de Gastos por Categoria

Cursor, vamos criar o widget de categorias com gráficos donut:

- Implemente ExpensesByCategoryCarousel. Dados de calculateExpensesByCategory. Para cada categoria, use calculateCategoryPercentage (em relação à receita total; se receita zero, 0%).
- Crie CategoryDonutCard: fundo branco, borda cinza clara, 160px largura. Donut 64px: anel externo colorido (% da categoria), interno vazio. Centro: percentual "30.0%". Abaixo: nome da categoria (truncar se longo), valor em moeda. Cores do anel: rotação (verde-limão, preta, cinza médio, etc).
- Carrossel: scroll horizontal. Navegação: mouse wheel horizontal, clique e arrasta, setas flutuantes (quando mouse sobre área; ~200px de deslocamento; desaparecem ao sair). Gradiente de máscara nas bordas esquerda/direita (fade). Hover no card: borda cinza clara → verde-limão. No mobile: só scroll por toque, sem setas.

Utilize variables do design system.

---

## PROMPT 8: Gráfico de Fluxo Financeiro

Cursor, vamos criar o gráfico de evolução de receitas e despesas:

- Implemente FinancialFlowChart (sugestão: Recharts). Card grande: título "Fluxo Financeiro" com ícone, legenda (círculo verde-limão "Receitas", círculo preto "Despesas").
- Gráfico: altura 300px, largura 100%. Eixo X: meses abreviados (Jan, Fev, …). Eixo Y: valores monetários compactos (R$ 2k, R$ 4k, …). Fundo cinza claro suave. Grid horizontal tracejado sutil.
- Duas áreas: Receitas (linha borda verde-limão 3px, preenchimento gradiente vertical verde-limão 30% opaco → transparente) e Despesas (linha borda preta 3px, preenchimento preto 10% opaco → transparente).
- Tooltip interativo: linha vertical fina acompanhando cursor; ao parar, tooltip com fundo branco, sombra, bordas arredondadas; linhas: mês em negrito, "Receitas: R$ X.XXX,XX" verde escuro, "Despesas: R$ X.XXX,XX" preto.
- Por enquanto dados mock fixos para sete meses. Estruturar para futuramente vir de transações agrupadas por mês.

Utilize variables do design system.

---

## PROMPT 9: Widget de Cartões de Crédito

Cursor, vamos criar o widget que exibe os cartões de crédito:

- Implemente CreditCardsWidget: container fundo cinza muito claro, bordas amplamente arredondadas. Header: ícone de cartão, título "Cartões", botão circular "+" (abre modal novo cartão; hover: fundo cinza claro).
- Lista de creditCards do contexto. Cada card: fundo branco, cantos arredondados, sombra. Três zonas: ícone à esquerda (bloco quadrado com cor do tema do cartão e ícone outline); centro (nome/banco, fatura atual em negrito, "•••• 1234"); direita (badge % uso = fatura/limite × 100).
- Hover: card translateY -4px ou -8px, sombra aumenta (200–300ms). Clique: abre modal de detalhes do cartão.
- Se mais de três cartões: paginação (avançar/voltar, indicador de página). Mobile: suporte a swipe horizontal.

Utilize variables do design system.

---

## PROMPT 10: Widget de Próximas Despesas

Cursor, vamos criar o widget de próximas despesas:

- Widget: fundo branco, borda clara. Header: ícone carteira (20px), título "Próximas despesas", botão circular "+" (40px) que abre modal nova transação.
- Lista de despesas pendentes (tipo "expense", não pagas). Ordenar por data de vencimento ascendente.
- Cada item: linha com padding; esquerda (descrição negrito; "Vence dia DD/MM" cinza escuro; conta/cartão—"Nubank conta" ou "Crédito Nubank **** 5897"—cinza claro); direita (valor "R$ XXX,XX" negrito; botão circular 32px com ícone check). Divisória fina entre itens.
- Botão check: hover (fundo verde claro, borda e ícone verde); ao clicar: marcar como paga, animar, remover da lista com animação; se recorrente, criar próxima ocorrência; se parcelada, atualizar contador; toast "Despesa marcada como paga!".
- Estado vazio: ícone check circular verde, "Nenhuma despesa pendente", borda tracejada. Por enquanto dados fictícios.

Utilize variables do design system.

---

## PROMPT 11: Tabela de Transações Detalhada

Cursor, vamos criar a tabela completa de transações:

- TransactionsTable. Header: título "Extrato Detalhado" à esquerda; à direita: busca local ("Buscar lançamentos...", 256px desktop / 100% mobile, tempo real em descrição OU categoria) e select tipo (Todos, Receitas, Despesas, 140px).
- Tabela: borda clara arredondada. Header com fundo cinza claro. Sete colunas: Avatar (50px, 24px; ou ícone genérico); Data (DD/MM/AAAA); Descrição (ícone em círculo verde claro para receita / vermelho claro para despesa + texto negrito); Categoria (badge cinza); Conta/Cartão (bankAccounts ou creditCards ou "Desconhecido"); Parcelas ("3x" ou "-"); Valor (alinhado à direita, "+" verde ou "-" preto, moeda).
- Zebra striping sutil. Hover: fundo cinza claro na linha.
- Filtros: globais (membro, período) + locais (busca, tipo). AND lógico. Ordenar por data decrescente.
- Paginação: 5 por página. Contador "Mostrando 1 a 5 de 47". Navegação: Anterior, números de página (atual preto; se >7 páginas: 3 primeiras, "...", 2 últimas), Próxima. Desabilitar Anterior/Próxima quando aplicável. Ao mudar página: scroll ao topo, fade-in. Ao mudar filtro: reset para página 1.
- Empty: "Nenhum lançamento encontrado." (96px altura). Dados de getFilteredTransactions + filtros locais.

Utilize variables do design system.

---

## PROMPT 12: Modal de Nova Transação

Cursor, vamos criar o modal completo para adicionar transações:

- Modal fullscreen (100% viewport), fundo branco. Três áreas: header fixo, conteúdo scrollável, footer fixo.
- Header: à esquerda ícone grande (64px) em círculo—verde-limão + seta baixo-esquerda (receita) ou preto + seta cima-direita branca (despesa); ao lado título "Nova Transação" e subtítulo cinza; à direita botão X (48px).
- Conteúdo: toggle tipo (Receita | Despesa) em container cinza claro; selecionado: fundo branco, sombra. Campos: Valor (56px, "R$" fixo, obrigatório); Descrição (56px, obrigatório, min 3 caracteres); Categoria (dropdown, "+ Nova Categoria" no topo, filtrar por tipo, obrigatório); grid 2 colunas: Membro (opcional, "Família (Geral)" = null) e Conta/Cartão (obrigatório, agrupado Contas Bancárias | Cartões de Crédito); Parcelamento (só se cartão + despesa): dropdown 1x–12x, desabilitar se recorrente; Checkbox despesa recorrente (só despesa): container azul suave, se parcelas >1x desabilitar e forçar 1x.
- Footer: "Cancelar" (borda, transparente) e "Salvar Transação" (preto, branco, pill).
- Validação ao salvar: valor >0, descrição ≥3, categoria e conta preenchidos. Se inválido: erro em vermelho. Se válido: criar transação (ID único, etc.), adicionar ao contexto, fechar com animação, toast "Transação registrada com sucesso!". Cancelar/X/overlay: fechar sem salvar.

Utilize variables do design system.

---

## PROMPT 13: Modal de Adicionar Membro

Cursor, vamos criar o modal para adicionar membros da família:

- AddMemberModal: overlay, modal centralizado. Header: "Adicionar Membro da Família", X. Footer: "Cancelar", "Adicionar Membro".
- Campos: Nome completo (obrigatório, min 3 caracteres); Função na família (obrigatório, combobox com sugestões: Pai, Mãe, Filho, Filha, Avô, Avó, Tio, Tia); Avatar: abas "URL" (input) e "Upload" (JPG/PNG, max 5MB)—opcional, senão avatar padrão; Renda mensal (opcional, numérico, moeda).
- Validação: nome e função obrigatórios. Se válido: criar membro (ID único, etc.), adicionar a familyMembers, fechar, toast "Membro adicionado com sucesso!". Cancelar/X/fora: fechar sem salvar.

Utilize variables do design system.

---

## PROMPT 14: Modal de Adicionar Cartão

Cursor, vamos criar o modal para adicionar contas bancárias e cartões de crédito:

- Modal centralizado (500–600px desktop, 90% mobile), overlay escuro. Header: "Adicionar Conta/Cartão", X. Footer: "Cancelar", "Adicionar".
- Toggle tipo: "Conta Bancária" | "Cartão de Crédito". Selecionado: preto/branco; não selecionado: branco/borda cinza.
- Campos: Nome (obrigatório, min 3; label varia por tipo); Titular (dropdown membros, obrigatório). Conta: Saldo inicial (obrigatório, moeda). Cartão: Dia fechamento (1–31), Dia vencimento (1–31), Limite total (>0, moeda), Últimos 4 dígitos (opcional, exatamente 4); Tema visual (obrigatório): três cards clicáveis—Black, Lime, White (um selecionado, borda azul).
- Validação conforme tipo. Se válido: criar e adicionar a bankAccounts ou creditCards, fechar, toast "Conta/Cartão adicionado com sucesso!". Erros: borda vermelha, mensagem abaixo.

Utilize variables do design system.

---

## PROMPT 15: Modal de Detalhes do Cartão

Cursor, vamos criar o modal que mostra informações completas do cartão:

- CardDetailsModal (maior). Header: nome do cartão, X.
- Área informações: grid 2–3 colunas (1 no mobile). Limite total, Fatura atual, Limite disponível (limite − fatura), % uso, Data fechamento ("Dia DD"), Data vencimento ("Dia DD"), "•••• 1234" se houver. Cada um em card com label cinza e valor negrito. Representação visual: donut ou barra de progresso do uso.
- Área despesas: tabela de transações type=expense e accountId=este cartão. Colunas: Data, Descrição, Categoria, Parcelas, Valor. Paginação 10/página se >10. Empty: "Nenhuma despesa registrada neste cartão ainda."
- Botões: "Ver Extrato Completo" (navega com filtro deste cartão), "Adicionar Despesa" (modal transação com conta pré-preenchida), "Editar Cartão", "Fechar". Fechar: X ou fora.

Utilize variables do design system.

---

## PROMPT 16: Modal de Filtros Mobile

Cursor, vamos criar o modal de filtros específico para mobile:

- FiltersMobileModal: abre ao tocar no botão de filtros no header mobile. Entrada: slide-in de baixo (translateY 100% → 0, 300ms).
- Header fixo: "Filtros", X (área toque ≥44x44). Conteúdo scrollável: "Tipo de Transação" (grid 3 colunas, 48px altura: Todos, Receitas, Despesas; selecionado preto/branco); "Membro da Família" (botões com wrap: "Todos", depois um por membro com avatar 32px + nome; 48px, pill; selecionado preto); "Período" (calendário um mês, seleção de intervalo, setas para mudar mês). Footer fixo: botão "Aplicar Filtros" (56px, preto, largura quase total).
- Estado temporário no componente. "Aplicar Filtros": copiar para contexto (transactionType, selectedMember, dateRange), fechar (slide-out para baixo), dashboard atualiza. X ou fora: fechar sem aplicar.

Utilize variables do design system; touch-friendly.

---

## PROMPT 17: View Completa de Cartões

Cursor, vamos criar a tela completa dedicada aos cartões de crédito:

- CardsView: header com "Cartões de Crédito" e botão "Novo Cartão" (preto, "+").
- Grid: mobile 1 col, tablet 2, desktop 3. Cada cartão: card grande com nome em negrito, logo se houver; limites, fatura, disponível, % uso; barra ou donut; datas fechamento/vencimento; "•••• 1234"; tema (borda/fundo); botões "Ver Detalhes", "Adicionar Despesa". Hover: card eleva e sombra. Clique no card: abre modal detalhes.
- Ordenar por fatura decrescente ou alfabeticamente. Empty: ícone cartão cinza, "Nenhum cartão cadastrado", "Cadastrar Primeiro Cartão". Dados de creditCards do contexto.

Utilize variables do design system.

---

## PROMPT 18: View Completa de Transações

Cursor, vamos criar a tela completa dedicada às transações:

- TransactionsView: header "Transações", "Nova Transação".
- Barra de filtros avançados (horizontal desktop, vertical mobile): busca, tipo, categoria, conta/cartão, membro, date range, status (todos/concluído/pendente). AND com filtros globais.
- Linha de resumo: total receitas, total despesas, diferença (verde/vermelho), quantidade de transações.
- TransactionsTable em modo expandido: 10/página, largura total. Ordenação clicável nos headers (Data, Valor, etc.) com ícone de seta. Botão "Exportar" (CSV ou PDF). Empty: "Nenhuma transação registrada ainda" + botão. Dados de getFilteredTransactions + filtros locais.

Utilize variables do design system.

---

## PROMPT 19: View de Perfil - Aba Informações

Cursor, vamos criar a tela de perfil do usuário:

- ProfileView com abas: "Informações" e "Configurações". Ao entrar, "Informações" ativa. Abas com borda inferior na ativa.
- Aba Informações: card de perfil (avatar 120px, nome, função, email, renda formatada; opcional "Editar Perfil"); card "Membros da Família" com lista (avatar 48px, nome, função, renda; fundo cinza claro; hover; clicável para editar). Se só um membro: mensagem + "Adicionar Membro da Família". Botão vermelho "Sair" com ícone logout. Dados: primeiro membro de familyMembers como usuário principal.

Utilize variables do design system.

---

## PROMPT 20: View de Perfil - Aba Configurações

Cursor, vamos criar a aba "Configurações":

- Conteúdo da aba Configurações: cards verticais. "Preferências de Exibição": toggle "Modo Escuro" (desabilitado, "Em breve"), select moeda "Real (R$)", select data "DD/MM/AAAA". "Notificações": toggles (lembrete vencimento, alerta limite, resumo email, objetivos alcançados)—apenas estado visual. "Gerenciar Categorias": Receita e Despesa com listas (nome, cor), "Adicionar Categoria", ícones editar/deletar ao hover. "Dados e Privacidade": "Exportar Todos os Dados" (JSON/CSV), "Limpar Todos os Dados" (vermelho, confirmação obrigatória), texto "Esta ação não pode ser desfeita". "Sobre o mycash+": versão "v1.0.0", descrição, links Termos e Política. No mobile: empilhar; desktop: alguns cards lado a lado se couber.

Utilize variables do design system.

---

## PROMPT 21: Animações e Transições Globais

Cursor, vamos implementar animações e transições suaves:

- Navegação entre seções: fade-out do conteúdo atual (200ms) e fade-in do novo (200ms), ligeiramente defasados.
- Entrada de cards em listas/grids: fade-in + slide-up (translateY 20→0, 300ms), stagger 50ms (tabela) ou 80ms (grids). Donuts do carrossel: scale 0.8→1 + fade-in, 400ms, stagger 100ms.
- Hover: botões (background 200ms ease-in-out); cards (transform, box-shadow 250ms ease-out); avatares (scale 200ms).
- Valores monetários nos cards: count-up de 0 ao valor em 800ms, ease-out. Barras de progresso: preencher em 1000ms ease-out.
- Modais: abertura—overlay fade-in 200ms, modal fade-in + scale 0.95→1 (250ms ease-out); fechamento—inverso. Modal filtros mobile: slide-in/out 300ms.
- Toasts: entrada slide-in da direita + fade-in (300ms); saída fade-out + slide-out (250ms).
- Skeleton loaders (preparação): cards—retângulos cinza, pulse (opacity 0.6–1, 1500ms); tabela—shimmer.
- Micro-interações: checkboxes/toggles scale ao clicar; inputs borda em foco (200ms); dropdowns fade-in + slide-down (200ms).
- Usar Framer Motion ou CSS. Constantes para durações/easings. Respeitar prefers-reduced-motion (desabilitar ou reduzir animações).

---

## PROMPT 22: Formatação e Utilitários

Cursor, vamos criar funções utilitárias:

- **Moeda:** formatCurrency (R$ 1.234,56, Intl pt-BR BRL, 2 decimais); formatCompactCurrency ("R$ 2,5k", "R$ 1,2M"); parseCurrencyInput (string → número, limpar R$/pontos/vírgula).
- **Datas:** formatDate (DD/MM/AAAA, date-fns pt-BR); formatDateLong ("15 de Janeiro de 2024"); formatDateRange ("01 jan - 31 jan, 2024"); formatRelativeDate ("Hoje", "Ontem", "Há 3 dias", date-fns formatDistanceToNow pt-BR).
- **Arrays/objetos:** groupByCategory; filterByDateRange; sortByDate (asc/desc).
- **Cálculos:** calculatePercentage (tratar div/0 → 0); calculateDifference (absoluta e %); calculateInstallmentValue.
- **Validação:** isValidEmail; isValidCPF (estrutura); isValidDate; isPositiveNumber.
- **IDs:** generateUniqueId (UUID v4 ou crypto.randomUUID).
- Organizar em currency.utils.ts, date.utils.ts, array.utils.ts, validation.utils.ts, etc. Export nomeado. JSDoc em cada função. Testes unitários para funções críticas.

---

## PROMPT 23: Responsividade e Ajustes Finais

Cursor, revisão completa de responsividade (apenas ajustes incrementais, sem refatorar arquitetura):

- 100% mobile-first. Breakpoints oficiais: Mobile &lt;768px, Tablet (md) 768–1279, Desktop (lg) 1280–1919, Wide (xl) ≥1920. Layout fluido: width 100%, max-width para limitar. Sem overflow horizontal.
- Sidebar só em ≥1280px; não renderizar em mobile/tablet. Header Mobile só &lt;1280px. Nunca os dois juntos. Grids: 1 col mobile, 2 tablet, 3–4 desktop; auto-fit/auto-fill. Conteúdo: px-4 mobile, px-6 tablet, px-8 desktop; max-w-[1400px] desktop, max-w-[1600px] wide, mx-auto.
- Tipografia: ~15% menor no mobile, evoluir (text-base md:text-lg lg:text-xl). Tabela: mobile = cards verticais; tablet = híbrida; desktop = tabela completa sem scroll horizontal. Gráficos: altura/labels proporcionais; sem overflow. Modais: mobile 100% viewport; max-width no desktop; só corpo rola.
- Touch: alvos ≥44x44px, ≥8px entre clicáveis, inputs ≥48px, font-size ≥16px (iOS). A11y: teclado, focus:ring, aria-label, alt, contraste 4.5:1. Validar em 375px, 768px, 1280px, 1920px.

---

## PROMPT 24: Testes e Validação Final

Cursor, finalizar com testes e validação:

- Fluxo de teste: primeira abertura, dados mock, filtrar por membro, ver atualização, remover filtro, período "Últimos 3 meses", busca, nova transação (preencher, salvar, toast, aparecer na tabela), modal cartão, navegar Cartões/Transações/Perfil, filtros, Configurações, voltar ao Dashboard. Anotar problemas.
- Validar cálculos com valores conhecidos. Validar filtros combinados (contar manualmente). Validar formatações (moeda R$ 1.234,56; data DD/MM/AAAA; % uma decimal). Responsividade 1920→375. Modais: centralizado, overlay, X/fora/Escape, validações. A11y: teclado, ordem tab, foco, leitor de tela. Performance: transições, 100 transações, abrir/fechar modais (memory leaks).
- Corrigir bugs. Tratamento de erros: div/0, arrays vazios, validar formulários. Feedback: toasts sucesso/erro, estados vazios, mensagens validação. Documentar decisões. README: objetivo, tecnologias, instalação, rodar, estrutura, componentes principais.

---

## PROMPT FINAL: Revisão e Entrega

Cursor, revisão final e preparação para entrega:

- Checklist: cinco seções navegáveis; sidebar + header mobile; context; cálculos; filtros; modais; design system; responsivo; animações; moeda/data BR; teclado; contraste; mock.
- Revisar código: pastas, nomes, sem duplicação, tipos, imports. Comentários JSDoc em funções complexas, remover obsoletos e console.log. README completo.
- Performance: re-renders, imagens, bundle, imports. TODOs "// TODO: integrar com Supabase" nos pontos de dados. Documentação de componentes (lista por domínio, props principais, hooks).
- Relatório final: total componentes, linhas (aprox.), funcionalidades completas/parciais, próximos passos. Projeto pronto para uso, testes e integração Supabase via MCP.

---

## Regras de execução (todos os prompts)

1. Reler Rules + DOCUMENTATION antes de cada prompt.
2. Consultar Figma (layout + variáveis) quando pertinente.
3. Hierarquia: semântica → primitiva → conversão; sem hardcode.
4. `npm run build` até passar antes de commit.
5. Atualizar DOCUMENTATION (progresso, tokens usados, conversões).
6. Aguardar aprovação antes do próximo prompt.
