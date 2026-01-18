import { CreditCardsWidget, DashboardHeader, ExpensesByCategoryCarousel, FinancialFlowChart, SummaryCards, UpcomingExpensesWidget } from '@/components/dashboard';

export function DashboardPage() {
  return (
    <main className="w-full px-4 pb-8 pt-8 md:px-6 lg:px-8">
      <DashboardHeader />

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
    </main>
  );
}
