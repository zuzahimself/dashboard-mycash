import { BalanceCard } from './BalanceCard';
import { IncomeCard } from './IncomeCard';
import { ExpenseCard } from './ExpenseCard';

/**
 * Três cards de resumo: Saldo Total (maior), Receitas, Despesas.
 * Desktop: em linha; Saldo ~2x mais largo. Mobile: empilhados.
 */
export function SummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-space-16 md:grid-cols-[2fr_1fr_1fr]">
      <BalanceCard />
      <IncomeCard />
      <ExpenseCard />
    </div>
  );
}
