import { useFinance } from '@/contexts';
import { useCountUp } from '@/hooks/useCountUp';

const DURATION_MS = 800;

export function BalanceCard() {
  const { calculateTotalBalance, getBalanceGrowthPercent } = useFinance();
  const balance = calculateTotalBalance();
  const growth = getBalanceGrowthPercent();
  const display = useCountUp(balance, DURATION_MS);

  return (
    <div className="relative rounded-shape-16 bg-secondary-900 overflow-hidden p-space-16 text-neutral-0">
      {/* Círculo verde-limão desfocado, cortado pelas bordas (canto inferior esquerdo) */}
      <div
        className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-brand-600 opacity-20 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-space-4">
        <div className="flex items-start justify-between gap-space-8">
          <span className="text-paragraph-small text-neutral-0/90">Saldo Total</span>
          <span className="inline-flex items-center gap-space-4 rounded-shape-100 px-space-8 py-space-4 bg-neutral-0/15 text-paragraph-xsmall font-label text-neutral-0">
            <IconTrendUp className="w-3.5 h-3.5 text-green-500" />
            +{growth}% esse mês
          </span>
        </div>
        <p className="text-heading-xsmall font-heading text-neutral-0">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(display)}
        </p>
      </div>
    </div>
  );
}

function IconTrendUp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
