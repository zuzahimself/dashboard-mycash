import { useMemo, useState } from 'react';
import { useFinance } from '@/contexts';
import type { CreditCard, CreditCardTheme } from '@/types';
import { AddAccountCardModal } from './AddAccountCardModal';
import { CardDetailsModal } from './CardDetailsModal';

const THEME_BG: Record<CreditCardTheme, string> = {
  black: 'bg-secondary-900',
  lime: 'bg-brand-600',
  white: 'bg-neutral-300',
};
const THEME_ICON: Record<CreditCardTheme, string> = {
  black: 'text-neutral-0',
  lime: 'text-neutral-1100',
  white: 'text-neutral-700',
};

function formatCurrency(v: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

type SortBy = 'fatura' | 'nome';

interface CardsViewProps {
  onAddExpense?: (accountId: string) => void;
  onAccountCardAdded?: () => void;
}

export function CardsView({ onAddExpense, onAccountCardAdded }: CardsViewProps) {
  const { creditCards, familyMembers, addCreditCard, addBankAccount } = useFinance();
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [detailsCard, setDetailsCard] = useState<CreditCard | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('fatura');

  const sorted = useMemo(() => {
    const arr = [...creditCards];
    if (sortBy === 'fatura') arr.sort((a, b) => b.currentBill - a.currentBill);
    else arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [creditCards, sortBy]);

  return (
    <div className="flex flex-col gap-space-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-heading-medium font-heading text-neutral-1100">Cartões de Crédito</h1>
        <div className="flex items-center gap-space-12">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
            className="h-10 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 text-label-small text-neutral-1100"
          >
            <option value="fatura">Fatura (maior primeiro)</option>
            <option value="nome">Alfabética</option>
          </select>
          <button
            type="button"
            onClick={() => { setNewModalOpen(true); }}
            className="flex h-10 items-center gap-space-8 rounded-shape-16 bg-secondary-900 px-space-16 text-label-small font-label text-neutral-0 hover:bg-neutral-1100"
          >
            <IconPlus className="h-5 w-5" />
            Novo Cartão
          </button>
        </div>
      </div>

      {/* Grid: 1 mobile, 2 tablet, 3 desktop */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-shape-16 border border-neutral-300 bg-neutral-200/30 py-space-48">
          <span className="mb-space-16 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-400 text-neutral-600">
            <IconCard className="h-8 w-8" />
          </span>
          <p className="text-paragraph-medium text-neutral-600 mb-space-8">Nenhum cartão cadastrado</p>
          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="rounded-shape-100 bg-secondary-900 px-space-24 py-space-12 text-label-medium font-label text-neutral-0 hover:bg-neutral-1100"
          >
            Cadastrar Primeiro Cartão
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-space-16 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((card) => (
            <CardBlock
              key={card.id}
              card={card}
              onClick={() => setDetailsCard(card)}
              onAddExpense={onAddExpense ? () => onAddExpense(card.id) : undefined}
            />
          ))}
        </div>
      )}

      {newModalOpen && (
        <AddAccountCardModal
          familyMembers={familyMembers}
          addBankAccount={addBankAccount}
          addCreditCard={addCreditCard}
          onClose={() => setNewModalOpen(false)}
          onSuccess={onAccountCardAdded}
          defaultType="card"
        />
      )}

      {detailsCard && (
        <CardDetailsModal
          card={detailsCard}
          onClose={() => setDetailsCard(null)}
          onAddExpense={onAddExpense ? () => onAddExpense(detailsCard.id) : undefined}
          onEditCard={() => setDetailsCard(null)}
        />
      )}
    </div>
  );
}

function CardBlock({ card, onClick, onAddExpense }: { card: CreditCard; onClick: () => void; onAddExpense?: () => void }) {
  const available = card.limit - card.currentBill;
  const usagePct = card.limit > 0 ? Math.round((card.currentBill / card.limit) * 100) : 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="flex flex-col rounded-shape-16 border-2 border-neutral-300 bg-surface-500 p-space-20 shadow transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-space-12 mb-space-16">
        <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-shape-16 ${THEME_BG[card.theme]} ${THEME_ICON[card.theme]}`}>
          <IconCard className="h-5 w-5" />
        </span>
        <span className="text-label-xsmall text-neutral-600">•••• {card.lastDigits || '****'}</span>
      </div>
      <h3 className="text-heading-xsmall font-heading text-neutral-1100 mb-space-4">{card.name}</h3>
      <p className="text-paragraph-small text-neutral-600 mb-space-12">Limite {formatCurrency(card.limit)} · Fatura {formatCurrency(card.currentBill)}</p>
      <div className="mb-space-12 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
        <div className="h-full rounded-full bg-red-600" style={{ width: `${Math.min(usagePct, 100)}%` }} />
      </div>
      <p className="text-paragraph-xsmall text-neutral-600 mb-space-16">
        {formatCurrency(available)} disponível · Fech. dia {card.closingDay} · Venct. dia {card.dueDay}
      </p>
      <div className="mt-auto flex flex-wrap gap-space-8">
        <button type="button" onClick={(e) => { e.stopPropagation(); onClick(); }} className="rounded-shape-100 border border-neutral-300 bg-transparent px-space-12 py-space-8 text-label-xsmall font-label text-neutral-1100 hover:bg-neutral-200">
          Ver Detalhes
        </button>
        {onAddExpense && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onAddExpense(); }} className="rounded-shape-100 border border-neutral-300 bg-transparent px-space-12 py-space-8 text-label-xsmall font-label text-neutral-1100 hover:bg-neutral-200">
            Adicionar Despesa
          </button>
        )}
      </div>
    </div>
  );
}

function IconCard({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>;
}
function IconPlus({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
}
