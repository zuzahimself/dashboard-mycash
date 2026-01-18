import { useFinance } from '@/contexts';
import { useCountUp } from '@/hooks/useCountUp';
import { SummaryCard } from './SummaryCard';

const DURATION_MS = 800;

function IconTrendUp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

export function IncomeCard() {
  const { calculateIncomeForPeriod } = useFinance();
  const value = calculateIncomeForPeriod();
  const display = useCountUp(value, DURATION_MS);

  return (
    <SummaryCard
      icon={<IconTrendUp className="h-5 w-5" />}
      iconClassName="bg-green-100 text-green-600"
      title="Receitas"
      value={display}
    />
  );
}
