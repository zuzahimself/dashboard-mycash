import { useFinance } from '@/contexts';
import { useCountUp } from '@/hooks/useCountUp';
import { SummaryCard } from './SummaryCard';

const DURATION_MS = 800;

function IconTrendDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

export function ExpenseCard() {
  const { calculateExpensesForPeriod } = useFinance();
  const value = calculateExpensesForPeriod();
  const display = useCountUp(value, DURATION_MS);

  return (
    <SummaryCard
      icon={<IconTrendDown className="h-5 w-5" />}
      iconClassName="bg-red-300 text-red-600"
      title="Despesas"
      value={display}
    />
  );
}
