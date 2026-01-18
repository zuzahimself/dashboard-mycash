import { useRef, useEffect, useState } from 'react';
import { useFinance } from '@/contexts';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { DateRange, TransactionTypeFilter } from '@/contexts';

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

function formatPeriod(range: DateRange): string {
  const d = (s: string) => ({
    day: s.slice(8, 10),
    month: MONTHS[parseInt(s.slice(5, 7), 10) - 1],
    year: s.slice(0, 4),
  });
  const a = d(range.startDate);
  const b = d(range.endDate);
  return `${a.day} ${a.month} - ${b.day} ${b.month}, ${b.year}`;
}

interface DashboardHeaderProps {
  onNovaTransacao?: () => void;
}

export function DashboardHeader({ onNovaTransacao }: DashboardHeaderProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const {
    searchText,
    setSearchText,
    dateRange,
    setDateRange,
    transactionType,
    setTransactionType,
    selectedMember,
    setSelectedMember,
    familyMembers,
    addFamilyMember,
  } = useFinance();

  const [filterOpen, setFilterOpen] = useState(false);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);

  // Fechar popovers ao clicar fora
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        filterOpen && filterRef.current && !filterRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement)?.closest('[data-filter-trigger]')
      ) setFilterOpen(false);
      if (
        periodOpen && periodRef.current && !periodRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement)?.closest('[data-period-trigger]')
      ) setPeriodOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [filterOpen, periodOpen]);

  const toggleMember = (id: string) => {
    setSelectedMember(selectedMember === id ? null : id);
  };

  return (
    <header className="flex flex-wrap items-center gap-space-12 w-full">
      {/* Busca — tempo real: setSearchText a cada caractere */}
      <div className="relative flex-1 min-w-[200px]">
        <IconSearch className="absolute left-space-12 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600" />
        <input
          type="search"
          placeholder="Pesquisar..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full pl-10 pr-space-12 py-space-12 rounded-shape-16 border border-neutral-300 bg-surface-500 text-paragraph-medium text-neutral-1100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600"
          aria-label="Pesquisar em descrição ou categoria"
        />
      </div>

      {/* Botão Filtros — desktop: FilterPopover; mobile: modal fullscreen deslize de baixo */}
      <div className="relative" ref={filterRef}>
        <button
          type="button"
          data-filter-trigger
          onClick={() => setFilterOpen((o) => !o)}
          className="w-10 h-10 rounded-shape-16 border border-neutral-300 bg-surface-500 flex items-center justify-center text-icon-default hover:bg-neutral-200 transition-colors"
          aria-label="Filtros"
          aria-expanded={filterOpen}
        >
          <IconSliders className="w-5 h-5" />
        </button>
        {filterOpen && (
          isDesktop ? (
            <div className="absolute top-full left-0 mt-space-4 z-50 min-w-[200px] rounded-shape-16 border border-neutral-300 bg-surface-500/95 backdrop-blur-md shadow-lg p-space-16">
              <FilterContent value={transactionType} onChange={setTransactionType} />
            </div>
          ) : (
            <FilterModal onClose={() => setFilterOpen(false)}>
              <FilterContent value={transactionType} onChange={(v) => { setTransactionType(v); setFilterOpen(false); }} />
            </FilterModal>
          )
        )}
      </div>

      {/* Seletor de período */}
      <div className="relative" ref={periodRef}>
        <button
          type="button"
          data-period-trigger
          onClick={() => setPeriodOpen((o) => !o)}
          className="flex items-center gap-space-8 px-space-12 py-space-12 rounded-shape-16 border border-neutral-300 bg-surface-500 text-paragraph-medium text-neutral-600 hover:bg-neutral-200 transition-colors"
          aria-label="Selecionar período"
          aria-expanded={periodOpen}
        >
          <IconCalendar className="w-5 h-5" />
          {formatPeriod(dateRange)}
        </button>
        {periodOpen && (
          <PeriodPicker
            value={dateRange}
            onChange={(r) => { setDateRange(r); setPeriodOpen(false); }}
            onClose={() => setPeriodOpen(false)}
            twoMonths={isDesktop}
          />
        )}
      </div>

      {/* Widget membros — avatares sobrepostos, +, AddMemberModal */}
      <div className="flex items-center gap-0">
        {familyMembers.slice(0, 5).map((m, i) => (
          <button
            key={m.id}
            type="button"
            onClick={() => toggleMember(m.id)}
            className="relative -ml-2 first:ml-0 w-9 h-9 rounded-full border-2 border-neutral-0 bg-neutral-400 flex items-center justify-center text-label-small font-label text-neutral-0 shadow shadow-neutral-4 hover:scale-110 transition-transform overflow-hidden"
            style={{ zIndex: 10 - i }}
            aria-pressed={selectedMember === m.id}
            aria-label={selectedMember === m.id ? `Remover filtro ${m.name}` : `Filtrar por ${m.name}`}
          >
            {m.avatarUrl ? (
              <img src={m.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>{m.name.charAt(0)}</span>
            )}
            {selectedMember === m.id && (
              <span className="absolute inset-0 rounded-full bg-secondary-900/80 flex items-center justify-center">
                <IconCheck className="w-4 h-4 text-neutral-0" />
              </span>
            )}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAddMemberOpen(true)}
          className="-ml-2 w-9 h-9 rounded-full border-2 border-neutral-0 bg-transparent flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
          aria-label="Adicionar membro"
        >
          <IconPlus className="w-4 h-4" />
        </button>
      </div>

      {/* Nova Transação — fundo preto, texto branco, +. Mobile: largura total, altura maior */}
      <button
        type="button"
        onClick={onNovaTransacao}
        className="flex items-center justify-center gap-space-8 px-space-16 py-space-12 rounded-shape-16 bg-secondary-900 text-neutral-0 text-label-medium font-label hover:bg-neutral-1100 transition-colors w-full md:w-auto min-h-[44px] md:min-h-0"
      >
        <IconPlus className="w-5 h-5" />
        Nova transação
      </button>

      {addMemberOpen && (
        <AddMemberModal
          onClose={() => setAddMemberOpen(false)}
          onAdd={(data) => { addFamilyMember(data); setAddMemberOpen(false); }}
        />
      )}
    </header>
  );
}

// --- FilterContent (rádio Tipo de Transação) ---
function FilterContent({ value, onChange }: { value: TransactionTypeFilter; onChange: (v: TransactionTypeFilter) => void }) {
  const opts: { v: TransactionTypeFilter; l: string }[] = [
    { v: 'all', l: 'Todos' },
    { v: 'income', l: 'Receitas' },
    { v: 'expense', l: 'Despesas' },
  ];
  return (
    <div>
      <p className="text-label-small font-label text-neutral-1100 mb-space-8">Tipo de Transação</p>
      <div className="flex flex-col gap-space-4">
        {opts.map(({ v, l }) => (
          <label key={v} className="flex items-center gap-space-8 cursor-pointer">
            <input
              type="radio"
              name="tx-type"
              checked={value === v}
              onChange={() => onChange(v)}
              className="w-4 h-4 text-brand-600"
            />
            <span className="text-paragraph-small text-neutral-1100">{l}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function FilterModal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center">
      <div className="absolute inset-0 bg-secondary-900/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-surface-500 rounded-t-2xl md:rounded-shape-16 md:mx-auto md:max-w-sm p-space-24 animate-slide-up" role="dialog" aria-modal="true" aria-label="Filtros">
        {children}
        <button type="button" onClick={onClose} className="mt-4 w-full py-2 text-label-medium text-neutral-600">Fechar</button>
      </div>
    </div>
  );
}

function getMonthPad(year: number, month: number): string[] {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const start = first.getDay();
  const days = last.getDate();
  const p: string[] = [];
  for (let i = 0; i < start; i++) p.push('');
  for (let i = 1; i <= days; i++) p.push(`${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`);
  return p;
}

// --- PeriodPicker: atalhos + calendário (2 meses desktop, 1 mobile com setas), range, confirmar ---
function PeriodPicker({
  value,
  onChange,
  onClose,
  twoMonths,
}: { value: DateRange; onChange: (r: DateRange) => void; onClose: () => void; twoMonths: boolean }) {
  const [base, setBase] = useState(value.startDate.slice(0, 7)); // YYYY-MM
  const [pickStart, setPickStart] = useState<string | null>(value.startDate);
  const [pickEnd, setPickEnd] = useState<string | null>(value.endDate);

  const setShortcut = (start: string, end: string) => {
    setPickStart(start);
    setPickEnd(end);
  };

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().slice(0, 10);
  const threeMonthsStart = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString().slice(0, 10);
  const yearStart = new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10);

  const onDayClick = (d: string) => {
    if (!pickStart) { setPickStart(d); setPickEnd(null); return; }
    if (!pickEnd) {
      const [a, b] = [pickStart, d].sort();
      setPickStart(a); setPickEnd(b);
      return;
    }
    setPickStart(d); setPickEnd(null);
  };

  const confirm = () => {
    if (pickStart && pickEnd) onChange({ startDate: pickStart, endDate: pickEnd });
    else if (pickStart) onChange({ startDate: pickStart, endDate: pickStart });
    onClose();
  };

  const [y, m] = base.split('-').map(Number);
  const first = new Date(y, m - 1, 1);
  const last = new Date(y, m, 0);
  const start = first.getDay();
  const days = last.getDate();
  const pad: string[] = [];
  for (let i = 0; i < start; i++) pad.push('');
  for (let i = 1; i <= days; i++) pad.push(`${y}-${String(m).padStart(2,'0')}-${String(i).padStart(2,'0')}`);

  const next = () => setBase(new Date(y, m, 1).toISOString().slice(0, 7));
  const prev = () => setBase(new Date(y, m - 2, 1).toISOString().slice(0, 7));

  return (
    <div className="absolute top-full left-0 mt-space-4 z-50 rounded-shape-16 border border-neutral-300 bg-surface-500 shadow-lg p-space-16 w-[280px] md:w-[360px]">
      <div className="flex flex-wrap gap-space-8 mb-space-12">
        <button type="button" onClick={() => setShortcut(thisMonthStart, thisMonthEnd)} className="px-2 py-1 text-paragraph-xsmall text-neutral-600 hover:bg-neutral-200 rounded">Este mês</button>
        <button type="button" onClick={() => setShortcut(lastMonthStart, lastMonthEnd)} className="px-2 py-1 text-paragraph-xsmall text-neutral-600 hover:bg-neutral-200 rounded">Mês passado</button>
        <button type="button" onClick={() => setShortcut(threeMonthsStart, thisMonthEnd)} className="px-2 py-1 text-paragraph-xsmall text-neutral-600 hover:bg-neutral-200 rounded">Últimos 3 meses</button>
        <button type="button" onClick={() => setShortcut(yearStart, thisMonthEnd)} className="px-2 py-1 text-paragraph-xsmall text-neutral-600 hover:bg-neutral-200 rounded">Este ano</button>
      </div>
      <div className={twoMonths ? 'flex gap-4' : ''}>
        <MonthBlock year={y} month={m} pad={pad} pickStart={pickStart} pickEnd={pickEnd} onDayClick={onDayClick} onPrev={prev} onNext={next} showNav={!twoMonths} />
        {twoMonths && (
          <MonthBlock
            year={m === 12 ? y + 1 : y}
            month={m === 12 ? 1 : m + 1}
            pad={getMonthPad(m === 12 ? y + 1 : y, m === 12 ? 1 : m + 1)}
            pickStart={pickStart}
            pickEnd={pickEnd}
            onDayClick={onDayClick}
            onPrev={() => {}}
            onNext={() => {}}
            showNav={false}
          />
        )}
      </div>
      <div className="flex justify-end gap-space-8 mt-space-12">
        <button type="button" onClick={onClose} className="px-4 py-2 text-paragraph-small text-neutral-600 hover:bg-neutral-200 rounded">Cancelar</button>
        <button type="button" onClick={confirm} className="px-4 py-2 text-label-small font-label text-neutral-0 bg-secondary-900 rounded hover:bg-neutral-1100">Confirmar</button>
      </div>
    </div>
  );
}

function MonthBlock({
  year, month, pad, pickStart, pickEnd, onDayClick, onPrev, onNext, showNav,
}: {
  year: number; month: number; pad: string[];
  pickStart: string | null; pickEnd: string | null;
  onDayClick: (d: string) => void;
  onPrev: () => void; onNext: () => void; showNav: boolean;
}) {
  const title = `${MONTHS[month - 1]} ${year}`;
  return (
    <div className="flex flex-col min-w-[140px]">
      {showNav && (
        <div className="flex items-center justify-between mb-2">
          <button type="button" onClick={onPrev} aria-label="Mês anterior">&larr;</button>
          <span className="text-label-small text-neutral-1100">{title}</span>
          <button type="button" onClick={onNext} aria-label="Próximo mês">&rarr;</button>
        </div>
      )}
      {!showNav && <p className="text-label-xsmall text-neutral-600 mb-1">{title}</p>}
      <div className="grid grid-cols-7 gap-0.5 text-center text-paragraph-xsmall">
        {['D','S','T','Q','Q','S','S'].map((d,i)=>(<span key={i} className="text-neutral-600">{d}</span>))}
        {pad.map((d, i) => (
          <button
            key={i}
            type="button"
            disabled={!d}
            onClick={() => d && onDayClick(d)}
            className={`py-1 rounded ${!d ? 'invisible' : 'hover:bg-neutral-200'} ${
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
  );
}

// --- AddMemberModal ---
function AddMemberModal({
  onClose,
  onAdd,
}: { onClose: () => void; onAdd: (d: { name: string; role: string; email?: string; monthlyIncome: number }) => void }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const r = role.trim();
    const income = parseFloat(String(monthlyIncome).replace(/\./g, '').replace(',', '.')) || 0;
    if (n && r) onAdd({ name: n, role: r, email: email.trim() || undefined, monthlyIncome: income });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-secondary-900/60" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-surface-500 rounded-shape-16 shadow-xl p-space-24 w-full max-w-md" role="dialog" aria-modal="true" aria-label="Adicionar membro">
        <h3 className="text-heading-xsmall font-heading text-neutral-1100 mb-space-16">Adicionar membro</h3>
        <form onSubmit={submit} className="flex flex-col gap-space-12">
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Nome</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8" />
          </label>
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Função (ex: Pai, Mãe)</span>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} required className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8" />
          </label>
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">E-mail (opcional)</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8" />
          </label>
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Renda mensal (R$)</span>
            <input type="text" inputMode="numeric" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} placeholder="0" className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8" />
          </label>
          <div className="flex gap-space-8 justify-end mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-paragraph-small text-neutral-600">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-label-small font-label text-neutral-0 bg-secondary-900 rounded-shape-16 hover:bg-neutral-1100">Adicionar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Ícones ---
function IconSearch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconSliders({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}
function IconCalendar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12" /></svg>
  );
}
function IconPlus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
  );
}
