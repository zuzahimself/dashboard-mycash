import { BalanceCard } from './BalanceCard';
import { IncomeCard } from './IncomeCard';
import { ExpenseCard } from './ExpenseCard';

/**
 * Três cards de resumo: Saldo Total (maior), Receitas, Despesas.
 * Desktop: em linha; Saldo ~2x mais largo. Mobile: empilhados.
 * flex-1 min-h-0 + grid-rows-[1fr] para os cards preencherem a altura e reduzir
 * o gap em relação ao chart (Figma: flex: 1 0 0; align-self: stretch).
 */
export function SummaryCards() {
  return (
    <div className="grid h-full min-h-0 flex-1 grid-cols-1 grid-rows-[1fr] gap-space-16 md:grid-cols-[2fr_1fr_1fr]">
      <BalanceCard />
      <IncomeCard />
      <ExpenseCard />
    </div>
  );
}
