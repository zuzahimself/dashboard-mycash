import { useState, useCallback, useEffect } from 'react';
import { useFinance } from '@/contexts';
import type { Transaction } from '@/types';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDue(date: string): string {
  const [, m, d] = date.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
}

function getAccountLabel(
  accountId: string,
  bankAccounts: { id: string; name: string }[],
  creditCards: { id: string; name: string; lastDigits?: string }[]
): string {
  const bank = bankAccounts.find((a) => a.id === accountId);
  if (bank) return bank.name;
  const card = creditCards.find((c) => c.id === accountId);
  if (card) return `Crédito ${card.name} **** ${card.lastDigits || '****'}`;
  return 'Conta';
}

function getNextRecurrenceDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setMonth(d.getMonth() + 1);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  if (d.getDate() > last) d.setDate(last);
  return d.toISOString().slice(0, 10);
}

export function UpcomingExpensesWidget() {
  const {
    transactions,
    bankAccounts,
    creditCards,
    addTransaction,
    updateTransaction,
    familyMembers,
  } = useFinance();
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const pending = transactions
    .filter((t) => t.type === 'expense' && !t.isPaid)
    .sort((a, b) => a.date.localeCompare(b.date));

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const onMarkPaid = useCallback(
    (t: Transaction) => {
      setRemovingId(t.id);
      setTimeout(() => {
        updateTransaction(t.id, { isPaid: true });
        if (t.isRecurring) {
          const { id: _id, ...rest } = t;
          addTransaction({ ...rest, date: getNextRecurrenceDate(t.date), isPaid: false });
        }
        setRemovingId(null);
        showToast('Despesa marcada como paga!');
      }, 280);
    },
    [updateTransaction, addTransaction, showToast]
  );

  return (
    <div className="rounded-2xl border border-neutral-300 bg-surface-500 p-space-16 md:p-space-24">
      {/* Header: ícone carteira 20px, título, botão + 40px */}
      <div className="flex items-center justify-between gap-space-12 mb-space-16">
        <div className="flex items-center gap-space-8">
          <span className="flex items-center justify-center text-icon-default w-5 h-5">
            <IconWallet className="w-5 h-5" />
          </span>
          <h2 className="text-heading-xsmall font-heading text-neutral-1100">Próximas despesas</h2>
        </div>
        <button
          type="button"
          onClick={() => setNewModalOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-surface-500 text-neutral-600 transition-colors hover:bg-neutral-200"
          aria-label="Nova transação"
        >
          <IconPlus className="w-5 h-5" />
        </button>
      </div>

      {/* Lista ou estado vazio */}
      {pending.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-space-12 rounded-shape-16 border border-dashed border-neutral-300 py-space-32">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <IconCheck className="w-6 h-6" />
          </span>
          <p className="text-paragraph-small text-neutral-600">Nenhuma despesa pendente</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {pending.map((t) => (
            <ExpenseRow
              key={t.id}
              transaction={t}
              accountLabel={getAccountLabel(t.accountId, bankAccounts, creditCards)}
              onMarkPaid={onMarkPaid}
              isRemoving={removingId === t.id}
            />
          ))}
        </div>
      )}

      {newModalOpen && (
        <NewTransactionModal
          bankAccounts={bankAccounts}
          creditCards={creditCards}
          familyMembers={familyMembers}
          onClose={() => setNewModalOpen(false)}
          onAdd={(d) => {
            addTransaction(d);
            setNewModalOpen(false);
          }}
        />
      )}

      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-16 py-space-12 text-paragraph-small text-neutral-1100 shadow-lg"
          role="status"
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function ExpenseRow({
  transaction,
  accountLabel,
  onMarkPaid,
  isRemoving,
}: {
  transaction: Transaction;
  accountLabel: string;
  onMarkPaid: (t: Transaction) => void;
  isRemoving: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-space-12 border-b border-neutral-200 py-space-12 last:border-b-0 transition-all duration-200 ${
        isRemoving ? 'scale-95 opacity-0' : ''
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-label-medium font-label text-neutral-1100 truncate">{transaction.description}</p>
        <p className="text-paragraph-small text-neutral-600">Vence dia {formatDue(transaction.date)}</p>
        <p className="text-paragraph-xsmall text-neutral-400">{accountLabel}</p>
      </div>
      <div className="flex flex-shrink-0 items-center gap-space-8">
        <span className="text-label-medium font-label text-neutral-1100">
          {formatCurrency(transaction.value)}
        </span>
        <button
          type="button"
          onClick={() => onMarkPaid(transaction)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-green-600/40 bg-green-100 text-green-600 transition-colors hover:border-green-600 hover:bg-green-100"
          aria-label="Marcar como paga"
        >
          <IconCheck className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function NewTransactionModal({
  bankAccounts,
  creditCards,
  familyMembers,
  onClose,
  onAdd,
}: {
  bankAccounts: { id: string; name: string }[];
  creditCards: { id: string; name: string }[];
  familyMembers: { id: string; name: string }[];
  onClose: () => void;
  onAdd: (d: Omit<Transaction, 'id'>) => void;
}) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [accountId, setAccountId] = useState(bankAccounts[0]?.id || creditCards[0]?.id || '');
  const [category, setCategory] = useState('Outros');

  const accounts = [
    ...bankAccounts.map((a) => ({ id: a.id, name: a.name })),
    ...creditCards.map((c) => ({ id: c.id, name: `Crédito ${c.name}` })),
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = parseFloat(String(value).replace(/\./g, '').replace(',', '.')) || 0;
    if (description.trim() && accountId) {
      onAdd({
        type: 'expense',
        value: v,
        description: description.trim(),
        category,
        date,
        accountId,
        memberId: familyMembers[0]?.id ?? null,
        installments: 1,
        status: 'completed',
        isRecurring: false,
        isPaid: false,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-secondary-900/60" onClick={onClose} aria-hidden />
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-shape-16 border border-neutral-300 bg-surface-500 p-space-24 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Nova transação"
      >
        <h3 className="text-heading-xsmall font-heading text-neutral-1100 mb-space-16">Nova despesa</h3>
        <form onSubmit={submit} className="flex flex-col gap-space-12">
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Descrição</span>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8 text-paragraph-medium"
            />
          </label>
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Valor (R$)</span>
            <input
              type="text"
              inputMode="numeric"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8"
            />
          </label>
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Vencimento</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8"
            />
          </label>
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Conta / Cartão</span>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Categoria</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8"
            >
              {['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Mercado', 'Contas', 'Outros'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <div className="mt-space-8 flex justify-end gap-space-8">
            <button type="button" onClick={onClose} className="px-4 py-2 text-paragraph-small text-neutral-600">
              Cancelar
            </button>
            <button type="submit" className="rounded-shape-16 bg-secondary-900 px-4 py-2 text-label-small font-label text-neutral-0 hover:bg-neutral-1100">
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function IconWallet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M16 14a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
    </svg>
  );
}
function IconPlus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function IconCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
