import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '@/contexts';
import { ROUTES } from '@/constants';
import type { CreditCard } from '@/types';

const EXPENSE_PER_PAGE = 10;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export interface CardDetailsModalProps {
  card: CreditCard;
  onClose: () => void;
  onAddExpense?: () => void;
  onEditCard: () => void;
}

export function CardDetailsModal({ card, onClose, onAddExpense, onEditCard }: CardDetailsModalProps) {
  const navigate = useNavigate();
  const { transactions } = useFinance();
  const [expensePage, setExpensePage] = useState(1);

  const available = card.limit - card.currentBill;
  const usagePct = card.limit > 0 ? Math.round((card.currentBill / card.limit) * 100) : 0;

  const expenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === 'expense' && t.accountId === card.id)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [transactions, card.id]
  );
  const totalExpPages = Math.max(1, Math.ceil(expenses.length / EXPENSE_PER_PAGE));
  const expenseSlice = expenses.slice((expensePage - 1) * EXPENSE_PER_PAGE, expensePage * EXPENSE_PER_PAGE);

  const handleVerExtrato = () => {
    navigate(ROUTES.TRANSACOES, { state: { accountId: card.id } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Detalhes do cartão">
      <div className="absolute inset-0 bg-secondary-900/60" onClick={onClose} aria-hidden />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-shape-16 border border-neutral-300 bg-surface-500 shadow-xl">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-neutral-200 px-space-16 py-space-16">
          <h3 className="text-heading-xsmall font-heading text-neutral-1100">{card.name}</h3>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-shape-16 border border-neutral-300 text-neutral-600 hover:bg-neutral-200" aria-label="Fechar">
            <IconX className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-space-16">
          <div className="mb-space-24 grid grid-cols-1 gap-space-12 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Limite total', value: formatCurrency(card.limit) },
              { label: 'Fatura atual', value: formatCurrency(card.currentBill) },
              { label: 'Limite disponível', value: formatCurrency(available) },
              { label: '% uso', value: `${usagePct}%` },
              { label: 'Data fechamento', value: `Dia ${String(card.closingDay).padStart(2, '0')}` },
              { label: 'Data vencimento', value: `Dia ${String(card.dueDay).padStart(2, '0')}` },
              ...(card.lastDigits ? [{ label: 'Cartão', value: `•••• ${card.lastDigits}` }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="rounded-shape-16 border border-neutral-200 bg-neutral-200/30 px-space-12 py-space-12">
                <p className="text-paragraph-xsmall text-neutral-600">{label}</p>
                <p className="text-label-medium font-label text-neutral-1100">{value}</p>
              </div>
            ))}
          </div>
          <div className="mb-space-24">
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
              <div className="h-full rounded-full bg-red-600 transition-all" style={{ width: `${Math.min(usagePct, 100)}%` }} />
            </div>
          </div>
          <div className="mb-space-16">
            <h4 className="text-label-medium font-label text-neutral-1100 mb-space-12">Despesas neste cartão</h4>
            <div className="overflow-hidden rounded-shape-16 border border-neutral-300">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="bg-neutral-200">
                      <th className="px-space-12 py-space-8 text-left text-label-xsmall font-label text-neutral-600">Data</th>
                      <th className="px-space-12 py-space-8 text-left text-label-xsmall font-label text-neutral-600">Descrição</th>
                      <th className="px-space-12 py-space-8 text-left text-label-xsmall font-label text-neutral-600">Categoria</th>
                      <th className="px-space-12 py-space-8 text-left text-label-xsmall font-label text-neutral-600">Parcelas</th>
                      <th className="px-space-12 py-space-8 text-right text-label-xsmall font-label text-neutral-600">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseSlice.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-space-12 py-space-24 text-center text-paragraph-small text-neutral-600">
                          Nenhuma despesa registrada neste cartão ainda.
                        </td>
                      </tr>
                    ) : (
                      expenseSlice.map((t) => (
                        <tr key={t.id} className="border-t border-neutral-200 hover:bg-neutral-200/50">
                          <td className="px-space-12 py-space-8 text-paragraph-small text-neutral-1100">{t.date.split('-').reverse().join('/')}</td>
                          <td className="px-space-12 py-space-8 text-paragraph-small text-neutral-1100">{t.description}</td>
                          <td className="px-space-12 py-space-8 text-paragraph-small text-neutral-600">{t.category}</td>
                          <td className="px-space-12 py-space-8 text-paragraph-small text-neutral-600">{t.installments > 1 ? `${t.installments}x` : '-'}</td>
                          <td className="px-space-12 py-space-8 text-right text-label-small font-label text-red-600">- {formatCurrency(t.value)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {totalExpPages > 1 && (
                <div className="flex items-center justify-end gap-2 border-t border-neutral-200 px-space-12 py-space-8">
                  <button type="button" onClick={() => setExpensePage((p) => Math.max(1, p - 1))} disabled={expensePage <= 1} className="rounded px-2 py-1 text-paragraph-xsmall text-neutral-600 hover:bg-neutral-200 disabled:opacity-50">Anterior</button>
                  <span className="text-paragraph-xsmall text-neutral-600">{expensePage} / {totalExpPages}</span>
                  <button type="button" onClick={() => setExpensePage((p) => Math.min(totalExpPages, p + 1))} disabled={expensePage >= totalExpPages} className="rounded px-2 py-1 text-paragraph-xsmall text-neutral-600 hover:bg-neutral-200 disabled:opacity-50">Próxima</button>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-space-8">
            <button type="button" onClick={handleVerExtrato} className="rounded-shape-100 border border-neutral-300 bg-transparent px-space-16 py-space-8 text-label-small font-label text-neutral-1100 hover:bg-neutral-200">Ver Extrato Completo</button>
            {onAddExpense && <button type="button" onClick={onAddExpense} className="rounded-shape-100 border border-neutral-300 bg-transparent px-space-16 py-space-8 text-label-small font-label text-neutral-1100 hover:bg-neutral-200">Adicionar Despesa</button>}
            <button type="button" onClick={onEditCard} className="rounded-shape-100 border border-neutral-300 bg-transparent px-space-16 py-space-8 text-label-small font-label text-neutral-1100 hover:bg-neutral-200">Editar Cartão</button>
            <button type="button" onClick={onClose} className="rounded-shape-100 bg-secondary-900 px-space-16 py-space-8 text-label-small font-label text-neutral-0 hover:bg-neutral-1100">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconX({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;
}
