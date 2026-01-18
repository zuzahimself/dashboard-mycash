import { useCallback, useEffect, useState } from 'react';
import { CreditCardsWidget, DashboardHeader, ExpensesByCategoryCarousel, FinancialFlowChart, NewTransactionModalFull, SummaryCards, TransactionsTable, UpcomingExpensesWidget } from '@/components/dashboard';

export function DashboardPage() {
  const [newTxOpen, setNewTxOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const onTxSuccess = useCallback(() => {
    setToast('Transação registrada com sucesso!');
  }, []);

  return (
    <main className="w-full px-4 pb-8 pt-8 md:px-6 lg:px-8">
      <DashboardHeader onNovaTransacao={() => setNewTxOpen(true)} />

      {/* Topo: Carousel + Summary | Cartões & Contas — items-stretch para a coluna esquerda ter altura e SummaryCards (flex-1) preencher */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:items-stretch">
        <div className="flex min-h-0 min-w-0 flex-col gap-6">
          <ExpensesByCategoryCarousel />
          <SummaryCards />
        </div>
        <div className="min-w-0">
          <CreditCardsWidget />
        </div>
      </div>

      {/* Chart (Fluxo financeiro) ao lado de Próximas despesas — items-stretch para mesma altura */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:items-stretch">
        <div className="min-h-0 min-w-0 h-full">
          <FinancialFlowChart />
        </div>
        <div className="min-h-0 min-w-0 h-full">
          <UpcomingExpensesWidget />
        </div>
      </div>

      {/* Extrato Detalhado (PROMPT 11) */}
      <div className="mt-6">
        <TransactionsTable />
      </div>

      {newTxOpen && (
        <NewTransactionModalFull
          onClose={() => setNewTxOpen(false)}
          onSuccess={onTxSuccess}
        />
      )}

      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[100] rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-16 py-space-12 text-paragraph-small text-neutral-1100 shadow-lg"
          role="status"
        >
          {toast}
        </div>
      )}
    </main>
  );
}
