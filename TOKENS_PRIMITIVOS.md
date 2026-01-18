# Tokens primitivos — mycash+

Extraídos do Figma (node 2005:2678) via `get_variable_defs`.  
Ordem de uso: 1º semântica, 2º primitiva, 3º conversão; nunca hardcode.

---

## Cores

| Token | Valor | Uso sugerido |
|-------|-------|--------------|
| `color/brand/700` | #c4e703 | Destaque brand |
| `color/brand/600` | #d7fe03 | Brand principal (CTAs, ativo) |
| `color/brand/200` | #f3ffb1 | Brand claro (hover, bg) |
| `Colors/Secondary/secondary-900` | #070A10 | Sidebar, fundos escuros |
| `Colors/Secondary/secondary-400` | #414652 | Texto secundário em fundo escuro |
| `color/neutral/1100` | #080b12 | Neutro escuro |
| `color/neutral/600` | #6b7280 | Texto secundário |
| `color/neutral/400` | #d1d5db | Borda, divisor |
| `color/neutral/300` | #e5e7eb | Borda clara |
| `color/neutral/200` | #f3f4f6 | Fundo de card |
| `color/neutral/0` | #ffffff | Branco |
| `Colors/Surface/surface-500` | #FFFFFF | Superfície |
| `Colors/Background/background-300` | #F7F8F9 | Fundo da página |
| `Colors/Accent/Green/green-600` | #38BB82 | Sucesso, receita |
| `color/green/500` | #44cb93 | Verde alternativo |
| `color/green/100` | #e8f9f2 | Fundo sucesso |
| `Colors/Accent/Red/red-600` | #D85E6D | Despesa, erro |
| `color/red/300` | #f5a5ad | Vermelho claro |
| `icon/default` | #171719 | Ícones padrão |
| `shadow/color/brand/16` | #dffe3529 | Sombra brand (rgba) |
| `shadow/color/neutral/4` | #1118270a | Sombra neutra (rgba) |

---

## Espaçamento (space)

| Token | Valor (px) |
|-------|------------|
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

---

## Shape (border-radius)

| Token | Valor (px) |
|-------|------------|
| `shape/16` | 16 |
| `shape/100` | 100 (círculo, pill) |

---

## Size (ícones / elementos fixos)

| Token | Valor (px) |
|-------|------------|
| `size/24` | 24 |
| `size/40` | 40 |

---

## Tipografia

| Token | Família | Peso | Tamanho | Line-height | Uso |
|-------|---------|------|---------|-------------|-----|
| `Heading/Medium` | Inter | 700 | 28px | 36 | Títulos de seção |
| `Heading/XSmall` | Inter | 700 | 20px | 28 | Subtítulos |
| `Label/Large` | Inter | 600 | 18px | 24 | Labels grandes |
| `Label/Medium` | Inter | 600 | 16px | 20 | Labels médios |
| `Label/Small` | Inter | 600 | 14px | 16 | Labels pequenos |
| `Label/XSmall` | Inter | 600 | 12px | 16 | Labels compactos |
| `Paragraph/Medium` | Inter | 400 | 16px | 24 | Corpo |
| `Paragraph/Small` | Inter | 400 | 14px | 20 | Corpo pequeno |
| `Paragraph/XSmall` | Inter | 400 | 12px | 20 | Caption |

Letter-spacing (Figma): 0.3 (exceto Headings com 0).

---

## Mapeamento para CSS (sugestão para `tokens.css`)

Nomes no CSS podem seguir o mesmo padrão, substituindo `/` por `--`:

- `--color-brand-700`, `--color-brand-600`, `--color-brand-200`
- `--color-neutral-0`, `--color-neutral-200`, … `--color-neutral-1100`
- `--color-secondary-900`, `--color-secondary-400`
- `--color-green-600`, `--color-green-500`, `--color-green-100`
- `--color-red-600`, `--color-red-300`
- `--space-0`, `--space-4`, `--space-8`, … `--space-56`
- `--shape-16`, `--shape-100`
- `--size-24`, `--size-40`

Tipografia: usar as medidas (font-size, line-height, weight) em classes utilitárias ou em `tokens.css` como variáveis.

---

## Placeholders do Figma (não são tokens)

- `username` → texto do usuário
- `username@email.com` → email do usuário

Usar em estados vazios ou dados reais via Supabase.
