import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFinance } from '@/contexts';
import type { Transaction } from '@/types';

const PER_PAGE = 5;
type LocalTypeFilter = 'all' | 'income' | 'expense';

function formatDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function getAccountOrCardLabel(
  accountId: string,
  bankAccounts: { id: string; name: string }[],
  creditCards: { id: string; name: string; lastDigits?: string }[]
): string {
  const bank = bankAccounts.find((a) => a.id === accountId);
  if (bank) return bank.name;
  const card = creditCards.find((c) => c.id === accountId);
  if (card) return `Crédito ${card.name} **** ${card.lastDigits || '****'}`;
  return 'Desconhecido';
}

export function TransactionsTable() {
  const {
    transactions,
    selectedMember,
    dateRange,
    bankAccounts,
    creditCards,
    familyMembers,
  } = useFinance();

  const [localSearch, setLocalSearch] = useState('');
  const [localType, setLocalType] = useState<LocalTypeFilter>('all');
  const [page, setPage] = useState(1);
  const tableRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (selectedMember != null) {
      list = list.filter((t) => t.memberId === selectedMember);
    }
    list = list.filter((t) => t.date >= dateRange.startDate && t.date <= dateRange.endDate);
    if (localType !== 'all') {
      list = list.filter((t) => t.type === localType);
    }
    const q = localSearch.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, selectedMember, dateRange, localType, localSearch]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const pageItems = filtered.slice(start, start + PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [localSearch, localType]);

  const goToPage = useCallback(
    (p: number) => {
      const next = Math.max(1, Math.min(p, totalPages));
      if (next !== page) {
        setPage(next);
        tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [page, totalPages]
  );

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const first = [1, 2, 3];
    const last = [totalPages - 1, totalPages];
    return [...first, -1, ...last];
  }, [totalPages]);

  return (
    <div ref={tableRef} className="rounded-shape-16 border border-neutral-300 bg-surface-500 overflow-hidden">
      {/* Header: título à esquerda; busca 256px desktop / 100% mobile e select 140px à direita */}
      <div className="flex flex-col gap-4 border-b border-neutral-200 p-space-16 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-heading-xsmall font-heading text-neutral-1100">Extrato Detalhado</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Buscar lançamentos..."
            className="w-full rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-8 text-paragraph-medium text-neutral-1100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600 sm:w-64"
            aria-label="Buscar por descrição ou categoria"
          />
          <select
            value={localType}
            onChange={(e) => setLocalType(e.target.value as LocalTypeFilter)}
            className="w-full rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-8 text-paragraph-medium text-neutral-1100 focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600 sm:w-[140px]"
            aria-label="Filtrar por tipo"
          >
            <option value="all">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>
      </div>

      {/* Tabela: 7 colunas; header fundo cinza claro; zebra; hover */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-neutral-200">
              <th className="w-[50px] px-space-12 py-space-12 text-left text-label-small font-label text-neutral-600">
                Membro
              </th>
              <th className="px-space-12 py-space-12 text-left text-label-small font-label text-neutral-600">
                Data
              </th>
              <th className="px-space-12 py-space-12 text-left text-label-small font-label text-neutral-600">
                Descrição
              </th>
              <th className="px-space-12 py-space-12 text-left text-label-small font-label text-neutral-600">
                Categoria
              </th>
              <th className="px-space-12 py-space-12 text-left text-label-small font-label text-neutral-600">
                Conta/Cartão
              </th>
              <th className="px-space-12 py-space-12 text-left text-label-small font-label text-neutral-600">
                Parcelas
              </th>
              <th className="px-space-12 py-space-12 text-right text-label-small font-label text-neutral-600">
                Valor
              </th>
            </tr>
          </thead>
          <tbody key={page} className="animate-fade-in">
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="min-h-[96px] px-space-12 py-space-24 text-center text-paragraph-small text-neutral-600">
                  Nenhum lançamento encontrado.
                </td>
              </tr>
            ) : (
              pageItems.map((t, i) => (
                <TableRow
                  key={t.id}
                  transaction={t}
                  isEven={(start + i) % 2 === 0}
                  accountLabel={getAccountOrCardLabel(t.accountId, bankAccounts, creditCards)}
                  memberName={t.memberId ? (familyMembers.find((m) => m.id === t.memberId)?.name ?? null) : null}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação: contador e navegação */}
      <div className="flex flex-col gap-4 border-t border-neutral-200 p-space-12 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-paragraph-small text-neutral-600">
          Mostrando {total === 0 ? 0 : start + 1} a {Math.min(start + PER_PAGE, total)} de {total}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-8 text-paragraph-small text-neutral-1100 transition-colors hover:bg-neutral-200 disabled:opacity-50 disabled:hover:bg-surface-500"
          >
            Anterior
          </button>
          <div className="flex items-center gap-1">
            {pageNumbers.map((n) =>
              n === -1 ? (
                <span key="ellipsis" className="px-2 text-neutral-400">
                  ...
                </span>
              ) : (
                <button
                  key={n}
                  type="button"
                  onClick={() => goToPage(n)}
                  className={`min-w-[36px] rounded-shape-16 px-space-8 py-space-4 text-paragraph-small font-label transition-colors ${
                    n === page
                      ? 'bg-secondary-900 text-neutral-0'
                      : 'bg-surface-500 text-neutral-1100 hover:bg-neutral-200'
                  }`}
                >
                  {n}
                </button>
              )
            )}
          </div>
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-8 text-paragraph-small text-neutral-1100 transition-colors hover:bg-neutral-200 disabled:opacity-50 disabled:hover:bg-surface-500"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}

function TableRow({
  transaction: t,
  isEven,
  accountLabel,
  memberName,
}: {
  transaction: Transaction;
  isEven: boolean;
  accountLabel: string;
  memberName: string | null;
}) {
  const isIncome = t.type === 'income';
  return (
    <tr
      className={`transition-colors hover:bg-neutral-200/70 ${
        isEven ? 'bg-surface-500' : 'bg-neutral-200/30'
      }`}
    >
      <td className="w-[50px] px-space-12 py-space-12">
        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-neutral-400 text-neutral-0">
          {memberName ? (
            <span className="text-paragraph-xsmall font-label" title={memberName}>
              {memberName.charAt(0).toUpperCase()}
            </span>
          ) : (
            <IconUser className="h-3.5 w-3.5" />
          )}
        </div>
      </td>
      <td className="px-space-12 py-space-12 text-paragraph-small text-neutral-1100">
        {formatDate(t.date)}
      </td>
      <td className="px-space-12 py-space-12">
        <div className="flex items-center gap-space-8">
          <span
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
              isIncome ? 'bg-green-100 text-green-600' : 'bg-red-300 text-red-600'
            }`}
          >
            {isIncome ? (
              <IconArrowDownLeft className="h-4 w-4" />
            ) : (
              <IconArrowUpRight className="h-4 w-4" />
            )}
          </span>
          <span className="text-label-medium font-label text-neutral-1100 truncate max-w-[180px]">
            {t.description}
          </span>
        </div>
      </td>
      <td className="px-space-12 py-space-12">
        <span className="inline-flex rounded-shape-100 px-space-8 py-space-4 text-label-xsmall font-label text-neutral-600 bg-neutral-200">
          {t.category}
        </span>
      </td>
      <td className="px-space-12 py-space-12 text-paragraph-small text-neutral-600 truncate max-w-[140px]">
        {accountLabel}
      </td>
      <td className="px-space-12 py-space-12 text-paragraph-small text-neutral-600">
        {t.installments > 1 ? `${t.installments}x` : '-'}
      </td>
      <td className="px-space-12 py-space-12 text-right">
        <span
          className={`text-label-medium font-label ${
            isIncome ? 'text-green-600' : 'text-neutral-1100'
          }`}
        >
          {isIncome ? '+' : '-'} {formatCurrency(t.value)}
        </span>
      </td>
    </tr>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

function IconArrowDownLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M17 7 7 17" />
      <path d="M17 17V7H7" />
    </svg>
  );
}

function IconArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M7 17 17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}
