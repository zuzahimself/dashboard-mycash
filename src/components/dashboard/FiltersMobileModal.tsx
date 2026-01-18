import { useEffect, useState } from 'react';
import { useFinance } from '@/contexts';
import type { TransactionTypeFilter } from '@/contexts';

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

interface FiltersMobileModalProps {
  onClose: () => void;
}

export function FiltersMobileModal({ onClose }: FiltersMobileModalProps) {
  const {
    transactionType,
    setTransactionType,
    selectedMember,
    setSelectedMember,
    dateRange,
    setDateRange,
    familyMembers,
  } = useFinance();

  const [tempType, setTempType] = useState<TransactionTypeFilter>(transactionType);
  const [tempMember, setTempMember] = useState<string | null>(selectedMember);
  const [closing, setClosing] = useState(false);
  const [base, setBase] = useState(dateRange.startDate.slice(0, 7));
  const [pickStart, setPickStart] = useState<string | null>(dateRange.startDate);
  const [pickEnd, setPickEnd] = useState<string | null>(dateRange.endDate);

  useEffect(() => {
    setTempType(transactionType);
    setTempMember(selectedMember);
    setBase(dateRange.startDate.slice(0, 7));
    setPickStart(dateRange.startDate);
    setPickEnd(dateRange.endDate);
  }, [transactionType, selectedMember, dateRange]);

  const [y, m] = base.split('-').map(Number);
  const first = new Date(y, m - 1, 1);
  const last = new Date(y, m, 0);
  const start = first.getDay();
  const days = last.getDate();
  const pad: string[] = [];
  for (let i = 0; i < start; i++) pad.push('');
  for (let i = 1; i <= days; i++) pad.push(`${y}-${String(m).padStart(2, '0')}-${String(i).padStart(2, '0')}`);

  const onDayClick = (d: string) => {
    if (!pickStart) { setPickStart(d); setPickEnd(null); return; }
    if (!pickEnd) {
      const [a, b] = [pickStart, d].sort();
      setPickStart(a); setPickEnd(b);
      return;
    }
    setPickStart(d); setPickEnd(null);
  };

  const apply = () => {
    setTransactionType(tempType);
    setSelectedMember(tempMember);
    const startD = pickStart || dateRange.startDate;
    const endD = pickEnd || pickStart || dateRange.endDate;
    setDateRange({ startDate: startD, endDate: endD });
    setClosing(true);
    setTimeout(onClose, 300);
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 300);
  };

  const typeOpts: { v: TransactionTypeFilter; l: string }[] = [
    { v: 'all', l: 'Todos' },
    { v: 'income', l: 'Receitas' },
    { v: 'expense', l: 'Despesas' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="Filtros">
      <div className="absolute inset-0 bg-secondary-900/60" onClick={handleClose} aria-hidden />
      <div
        className={`relative flex max-h-[85vh] flex-col rounded-t-2xl bg-surface-500 shadow-xl ${closing ? 'animate-slide-down' : 'animate-slide-up'}`}
      >
        {/* Header — X com área ≥44x44 */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-neutral-200 px-space-16 py-space-12">
          <h3 className="text-heading-xsmall font-heading text-neutral-1100">Filtros</h3>
          <button
            type="button"
            onClick={handleClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-shape-16 text-neutral-600 hover:bg-neutral-200"
            aria-label="Fechar"
          >
            <IconX className="h-6 w-6" />
          </button>
        </div>

        {/* Conteúdo scrollável */}
        <div className="min-h-0 flex-1 overflow-y-auto p-space-16">
          {/* Tipo de Transação — grid 3 col, 48px */}
          <div className="mb-space-24">
            <p className="text-label-small font-label text-neutral-1100 mb-space-8">Tipo de Transação</p>
            <div className="grid grid-cols-3 gap-space-8">
              {typeOpts.map(({ v, l }) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setTempType(v)}
                  className={`h-12 rounded-shape-16 text-label-small font-label transition-colors ${
                    tempType === v ? 'bg-secondary-900 text-neutral-0' : 'border border-neutral-300 bg-surface-500 text-neutral-1100'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Membro da Família — wrap, Todos + avatar 32px + nome, 48px pill */}
          <div className="mb-space-24">
            <p className="text-label-small font-label text-neutral-1100 mb-space-8">Membro da Família</p>
            <div className="flex flex-wrap gap-space-8">
              <button
                type="button"
                onClick={() => setTempMember(null)}
                className={`flex h-12 items-center gap-space-8 rounded-shape-100 px-space-16 text-label-small font-label transition-colors ${
                  tempMember === null ? 'bg-secondary-900 text-neutral-0' : 'border border-neutral-300 bg-surface-500 text-neutral-1100'
                }`}
              >
                Todos
              </button>
              {familyMembers.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setTempMember(m.id)}
                  className={`flex h-12 items-center gap-space-8 rounded-shape-100 px-space-16 text-label-small font-label transition-colors ${
                    tempMember === m.id ? 'bg-secondary-900 text-neutral-0' : 'border border-neutral-300 bg-surface-500 text-neutral-1100'
                  }`}
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-400 text-neutral-0">
                    {m.avatarUrl ? <img src={m.avatarUrl} alt="" className="h-full w-full object-cover" /> : <span>{m.name.charAt(0)}</span>}
                  </span>
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Período — 1 mês, setas */}
          <div className="mb-space-24">
            <p className="text-label-small font-label text-neutral-1100 mb-space-8">Período</p>
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-space-8">
                <button type="button" onClick={() => setBase(new Date(y, m - 2, 1).toISOString().slice(0, 7))} className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-200" aria-label="Mês anterior">
                  ←
                </button>
                <span className="text-label-small text-neutral-1100">{MONTHS[m - 1]} {y}</span>
                <button type="button" onClick={() => setBase(new Date(y, m, 1).toISOString().slice(0, 7))} className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-200" aria-label="Próximo mês">
                  →
                </button>
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-center text-paragraph-xsmall">
                {['D','S','T','Q','Q','S','S'].map((d, i) => (
                  <span key={i} className="text-neutral-600">{d}</span>
                ))}
                {pad.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={!d}
                    onClick={() => d && onDayClick(d)}
                    className={`min-h-[36px] rounded py-1 ${!d ? 'invisible' : 'hover:bg-neutral-200'} ${
                      d === pickStart || d === pickEnd
                        ? 'bg-secondary-900 text-neutral-0'
                        : pickStart && pickEnd && d >= pickStart && d <= pickEnd
                          ? 'bg-neutral-200'
                          : 'text-neutral-1100'
                    }`}
                  >
                    {d ? d.slice(8, 10) : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer — Aplicar Filtros 56px, preto, quase total */}
        <div className="flex-shrink-0 border-t border-neutral-200 p-space-16">
          <button
            type="button"
            onClick={apply}
            className="h-14 w-full rounded-shape-16 bg-secondary-900 text-label-medium font-label text-neutral-0 hover:bg-neutral-1100"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}

function IconX({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;
}
