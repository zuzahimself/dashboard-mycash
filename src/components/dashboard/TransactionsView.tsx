import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFinance } from '@/contexts';

const PER_PAGE = 10;
type SortKey = 'date' | 'value' | 'description';
type StatusFilter = 'all' | 'completed' | 'pending';

function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
function getAccountLabel(accountId: string, bankAccounts: { id: string; name: string }[], creditCards: { id: string; name: string; lastDigits?: string }[]): string {
  const b = bankAccounts.find((a) => a.id === accountId);
  if (b) return b.name;
  const c = creditCards.find((x) => x.id === accountId);
  if (c) return `Crédito ${c.name} **** ${c.lastDigits || '****'}`;
  return '—';
}

function toCSV(rows: { Data: string; Descrição: string; Categoria: string; Valor: string; Tipo: string }[]): string {
  const head = 'Data;Descrição;Categoria;Valor;Tipo';
  return [head, ...rows.map((r) => `${r.Data};"${r.Descrição}";${r.Categoria};${r.Valor};${r.Tipo}`)].join('\r\n');
}

interface TransactionsViewProps {
  onNewTransaction: () => void;
}

export function TransactionsView({ onNewTransaction }: TransactionsViewProps) {
  const location = useLocation();
  const {
    getFilteredTransactions,
    setSearchText,
    setTransactionType,
    setSelectedMember,
    setDateRange,
    dateRange,
    searchText,
    transactionType,
    selectedMember,
    bankAccounts,
    creditCards,
    familyMembers,
  } = useFinance();

  const [localCategory, setLocalCategory] = useState<string>('');
  const [localAccount, setLocalAccount] = useState<string>(() => (location.state as { accountId?: string })?.accountId ?? '');
  const [localStatus, setLocalStatus] = useState<StatusFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const tableRef = useRef<HTMLDivElement>(null);

  const base = useMemo(() => getFilteredTransactions(), [getFilteredTransactions]);
  const filtered = useMemo(() => {
    let list = [...base];
    if (localCategory) list = list.filter((t) => t.category === localCategory);
    if (localAccount) list = list.filter((t) => t.accountId === localAccount);
    if (localStatus === 'completed') list = list.filter((t) => t.status === 'completed');
    if (localStatus === 'pending') list = list.filter((t) => t.status === 'pending');
    const mult = sortAsc ? 1 : -1;
    if (sortKey === 'date') list.sort((a, b) => mult * a.date.localeCompare(b.date));
    else if (sortKey === 'value') list.sort((a, b) => mult * (a.value - b.value));
    else list.sort((a, b) => mult * a.description.localeCompare(b.description));
    return list;
  }, [base, localCategory, localAccount, localStatus, sortKey, sortAsc]);

  const totalIncome = useMemo(() => filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.value, 0), [filtered]);
  const totalExpense = useMemo(() => filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.value, 0), [filtered]);
  const diff = totalIncome - totalExpense;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const pageItems = filtered.slice(start, start + PER_PAGE);

  const categories = useMemo(() => [...new Set(base.map((t) => t.category))].sort(), [base]);
  const accounts = useMemo(
    () => [
      ...bankAccounts.map((a) => ({ id: a.id, label: a.name })),
      ...creditCards.map((c) => ({ id: c.id, label: `Crédito ${c.name}` })),
    ],
    [bankAccounts, creditCards]
  );

  useEffect(() => { setPage(1); }, [localCategory, localAccount, localStatus, sortKey, sortAsc]);
  const toggleSort = useCallback((k: SortKey) => { setSortKey(k); setSortAsc((a) => (sortKey === k ? !a : false)); }, [sortKey]);

  const exportCSV = () => {
    const rows = filtered.map((t) => ({
      Data: formatDate(t.date),
      Descrição: t.description,
      Categoria: t.category,
      Valor: t.type === 'income' ? `+${formatCurrency(t.value)}` : `-${formatCurrency(t.value)}`,
      Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
    }));
    const blob = new Blob(['\ufeff' + toCSV(rows)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `transacoes-${dateRange.startDate}-${dateRange.endDate}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="flex flex-col gap-space-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-heading-medium font-heading text-neutral-1100">Transações</h1>
        <button type="button" onClick={onNewTransaction} className="flex h-10 items-center gap-space-8 rounded-shape-16 bg-secondary-900 px-space-16 text-label-small font-label text-neutral-0 hover:bg-neutral-1100">
          <IconPlus className="h-5 w-5" />
          Nova Transação
        </button>
      </div>

      {/* Filtros: horizontal desktop, vertical mobile */}
      <div className="flex flex-wrap items-end gap-space-12 rounded-shape-16 border border-neutral-300 bg-surface-500 p-space-16">
        <input type="search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Busca" className="h-10 w-40 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 text-paragraph-small md:w-48" />
        <select value={transactionType} onChange={(e) => setTransactionType(e.target.value as 'all'|'income'|'expense')} className="h-10 w-32 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 text-paragraph-small">
          <option value="all">Tipo: Todos</option>
          <option value="income">Receitas</option>
          <option value="expense">Despesas</option>
        </select>
        <select value={localCategory} onChange={(e) => setLocalCategory(e.target.value)} className="h-10 w-36 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 text-paragraph-small">
          <option value="">Categoria: Todas</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={localAccount} onChange={(e) => setLocalAccount(e.target.value)} className="h-10 w-40 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 text-paragraph-small">
          <option value="">Conta/Cartão: Todos</option>
          {accounts.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
        <select value={selectedMember ?? ''} onChange={(e) => setSelectedMember(e.target.value || null)} className="h-10 w-36 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 text-paragraph-small">
          <option value="">Membro: Todos</option>
          {familyMembers.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <div className="flex gap-2">
          <input type="date" value={dateRange.startDate} onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })} className="h-10 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 text-paragraph-small" />
          <input type="date" value={dateRange.endDate} onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })} className="h-10 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 text-paragraph-small" />
        </div>
        <select value={localStatus} onChange={(e) => setLocalStatus(e.target.value as StatusFilter)} className="h-10 w-32 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 text-paragraph-small">
          <option value="all">Status: Todos</option>
          <option value="completed">Concluído</option>
          <option value="pending">Pendente</option>
        </select>
      </div>

      {/* Resumo */}
      <div className="flex flex-wrap gap-space-16 rounded-shape-16 border border-neutral-300 bg-neutral-200/30 p-space-16">
        <span className="text-paragraph-small text-neutral-600">Receitas: <strong className="text-green-600">{formatCurrency(totalIncome)}</strong></span>
        <span className="text-paragraph-small text-neutral-600">Despesas: <strong className="text-red-600">{formatCurrency(totalExpense)}</strong></span>
        <span className="text-paragraph-small text-neutral-600">Diferença: <strong className={diff >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(diff)}</strong></span>
        <span className="text-paragraph-small text-neutral-600">{total} transações</span>
      </div>

      {/* Tabela + Export + Empty */}
      <div ref={tableRef} className="rounded-shape-16 border border-neutral-300 bg-surface-500 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 p-space-16">
          <h2 className="text-heading-xsmall font-heading text-neutral-1100">Extrato</h2>
          <button type="button" onClick={exportCSV} className="rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-8 text-label-small text-neutral-1100 hover:bg-neutral-200">Exportar CSV</button>
        </div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-space-48">
            <p className="text-paragraph-medium text-neutral-600 mb-space-16">Nenhuma transação registrada ainda.</p>
            <button type="button" onClick={onNewTransaction} className="rounded-shape-100 bg-secondary-900 px-space-24 py-space-12 text-label-medium font-label text-neutral-0 hover:bg-neutral-1100">Nova Transação</button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="bg-neutral-200">
                    <th className="px-space-12 py-space-12 text-left text-label-small font-label text-neutral-600">Membro</th>
                    <th className="px-space-12 py-space-12 text-left text-label-small font-label text-neutral-600">
                      <button type="button" onClick={() => toggleSort('date')} className="flex items-center gap-1 hover:underline">Data {sortKey === 'date' ? (sortAsc ? '↑' : '↓') : ''}</button>
                    </th>
                    <th className="px-space-12 py-space-12 text-left text-label-small font-label text-neutral-600">Descrição</th>
                    <th className="px-space-12 py-space-12 text-left text-label-small font-label text-neutral-600">Categoria</th>
                    <th className="px-space-12 py-space-12 text-left text-label-small font-label text-neutral-600">Conta/Cartão</th>
                    <th className="px-space-12 py-space-12 text-left text-label-small font-label text-neutral-600">Parcelas</th>
                    <th className="px-space-12 py-space-12 text-right text-label-small font-label text-neutral-600">
                      <button type="button" onClick={() => toggleSort('value')} className="flex items-center justify-end gap-1 hover:underline">Valor {sortKey === 'value' ? (sortAsc ? '↑' : '↓') : ''}</button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((t, i) => (
                    <tr key={t.id} className={`border-t border-neutral-200 hover:bg-neutral-200/70 ${(start + i) % 2 === 0 ? 'bg-surface-500' : 'bg-neutral-200/30'}`}>
                      <td className="px-space-12 py-space-12">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-400 text-neutral-0 text-paragraph-xsmall">
                          {t.memberId ? (familyMembers.find((m) => m.id === t.memberId)?.name?.charAt(0) ?? '?') : '—'}
                        </span>
                      </td>
                      <td className="px-space-12 py-space-12 text-paragraph-small text-neutral-1100">{formatDate(t.date)}</td>
                      <td className="px-space-12 py-space-12 text-paragraph-small text-neutral-1100">{t.description}</td>
                      <td className="px-space-12 py-space-12"><span className="rounded-shape-100 bg-neutral-200 px-space-8 py-space-4 text-label-xsmall text-neutral-600">{t.category}</span></td>
                      <td className="px-space-12 py-space-12 text-paragraph-small text-neutral-600">{getAccountLabel(t.accountId, bankAccounts, creditCards)}</td>
                      <td className="px-space-12 py-space-12 text-paragraph-small text-neutral-600">{t.installments > 1 ? `${t.installments}x` : '-'}</td>
                      <td className="px-space-12 py-space-12 text-right"><span className={t.type === 'income' ? 'text-green-600' : 'text-neutral-1100'}>{t.type === 'income' ? '+' : '-'} {formatCurrency(t.value)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 p-space-12">
              <p className="text-paragraph-small text-neutral-600">Mostrando {total === 0 ? 0 : start + 1} a {Math.min(start + PER_PAGE, total)} de {total}</p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-8 text-paragraph-small disabled:opacity-50">Anterior</button>
                <span className="text-paragraph-small text-neutral-600">{page} / {totalPages}</span>
                <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-8 text-paragraph-small disabled:opacity-50">Próxima</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function IconPlus({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
