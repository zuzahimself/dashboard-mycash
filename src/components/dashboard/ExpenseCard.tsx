import { useFinance } from '@/contexts';
import { useCountUp } from '@/hooks/useCountUp';

const DURATION_MS = 800;

export function ExpenseCard() {
  const { calculateExpensesForPeriod } = useFinance();
  const value = calculateExpensesForPeriod();
  const display = useCountUp(value, DURATION_MS);

  return (
    <div className="rounded-shape-16 bg-surface-500 border border-neutral-300 p-space-16 flex flex-col gap-space-4">
      <div className="flex items-start justify-between gap-space-8">
        <span className="text-paragraph-small text-neutral-600">Despesas</span>
        <span className="w-8 h-8 rounded-full bg-red-300 flex items-center justify-center flex-shrink-0">
          <IconArrowUpRight className="w-4 h-4 text-red-600" />
        </span>
      </div>
      <p className="text-heading-xsmall font-heading text-neutral-1100">
        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(display)}
      </p>
    </div>
  );
}

function IconArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}
