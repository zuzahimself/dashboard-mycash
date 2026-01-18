import { CreditCardsWidget, DashboardHeader, ExpensesByCategoryCarousel, FinancialFlowChart, SummaryCards, UpcomingExpensesWidget } from '@/components/dashboard';

export function DashboardPage() {
  return (
    <main className="w-full px-4 md:px-6 lg:px-8 pt-8">
      <DashboardHeader />

      {/* Figma: bloco esquerdo = Carousel + Summary; bloco direito = Cartões & Contas */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <ExpensesByCategoryCarousel />
          <SummaryCards />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <CreditCardsWidget />
          <UpcomingExpensesWidget />
        </div>
      </div>

      <div className="mt-6">
        <FinancialFlowChart />
      </div>
    </main>
  );
}
