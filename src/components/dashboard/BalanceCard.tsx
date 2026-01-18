import { useFinance } from '@/contexts';
import { useCountUp } from '@/hooks/useCountUp';
import { SummaryCard } from './SummaryCard';

const DURATION_MS = 800;

function IconDollar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export function BalanceCard() {
  const { calculateTotalBalance } = useFinance();
  const value = calculateTotalBalance();
  const display = useCountUp(value, DURATION_MS);

  return (
    <SummaryCard
      icon={<IconDollar className="h-5 w-5" />}
      iconClassName="bg-neutral-200 text-neutral-600"
      title="Saldo total"
      value={display}
    />
  );
}
