import { DashboardHeader, SummaryCards } from '@/components/dashboard';

export function DashboardPage() {
  return (
    <main className="w-full px-4 md:px-6 lg:px-8 pt-8">
      <DashboardHeader />
      <div className="mt-6">
        <SummaryCards />
      </div>
    </main>
  );
}
