/**
 * Card de categoria com donut 64px, % no centro, nome e valor.
 * Largura 160px; hover: borda → verde-limão.
 * Cores do anel: rotação (brand-600, secondary-900, neutral-600, neutral-400, green-500, red-300).
 */
interface CategoryDonutCardProps {
  category: string;
  value: number;
  percent: number; // em relação à receita (0 se receita zero)
  color: string;   // classe Tailwind para o stroke do anel (ex: stroke-brand-600)
}

const DONUT_SIZE = 64;
const DONUT_R = 28;
const STROKE = 8;
const CIRCUM = 2 * Math.PI * DONUT_R;

export function CategoryDonutCard({ category, value, percent, color }: CategoryDonutCardProps) {
  const dash = (Math.min(100, Math.max(0, percent)) / 100) * CIRCUM;

  return (
    <article
      className="flex-shrink-0 w-[160px] rounded-shape-16 bg-surface-500 border border-neutral-300 p-space-16 flex flex-col items-center gap-space-8 transition-colors hover:border-brand-600"
    >
      {/* Donut 64px: anel externo colorido (% da categoria), centro percentual */}
      <div className="relative w-[64px] h-[64px] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
          className="absolute inset-0 w-full h-full -rotate-90"
          aria-hidden
        >
          {/* Trilha: anel cinza (cheio) */}
          <circle
            cx={DONUT_SIZE / 2}
            cy={DONUT_SIZE / 2}
            r={DONUT_R}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            className="text-neutral-300"
          />
          {/* Arco colorido: % da categoria */}
          <circle
            cx={DONUT_SIZE / 2}
            cy={DONUT_SIZE / 2}
            r={DONUT_R}
            fill="none"
            stroke="currentColor"
            strokeWidth={STROKE}
            strokeDasharray={`${dash} ${CIRCUM}`}
            strokeLinecap="round"
            className={color}
          />
        </svg>
        <span className="relative text-paragraph-small font-label text-neutral-1100">
          {percent.toFixed(1)}%
        </span>
      </div>

      {/* Nome da categoria (truncar se longo) */}
      <p className="text-paragraph-small text-neutral-1100 truncate w-full text-center" title={category}>
        {category}
      </p>

      {/* Valor em moeda */}
      <p className="text-heading-xsmall font-heading text-neutral-1100">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
      </p>
    </article>
  );
}

/** Cores para rotação no carrossel: verde-limão, preta, cinza, etc. */
export const CATEGORY_RING_COLORS = [
  'text-brand-600',      // verde-limão
  'text-secondary-900',  // preta
  'text-neutral-600',    // cinza médio
  'text-neutral-400',    // cinza mais claro
  'text-green-500',
  'text-red-600',
] as const;
