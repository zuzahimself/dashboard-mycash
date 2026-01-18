import { useState, useRef } from 'react';
import { useFinance } from '@/contexts';
import type { CreditCard, CreditCardTheme } from '@/types';
import { AddAccountCardModal } from './AddAccountCardModal';
import { CardDetailsModal } from './CardDetailsModal';

const CARDS_PER_PAGE = 3;
const SWIPE_THRESHOLD = 50;

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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

interface CreditCardsWidgetProps {
  onAccountCardAdded?: () => void;
  onAddExpense?: (accountId: string) => void;
}

export function CreditCardsWidget({ onAccountCardAdded, onAddExpense }: CreditCardsWidgetProps) {
  const { creditCards, familyMembers, addCreditCard, addBankAccount } = useFinance();
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [detailsCard, setDetailsCard] = useState<CreditCard | null>(null);
  const [page, setPage] = useState(0);
  const touchStart = useRef(0);

  const totalPages = Math.max(1, Math.ceil(creditCards.length / CARDS_PER_PAGE));
  const canPaginate = creditCards.length > CARDS_PER_PAGE;
  const safePage = Math.min(page, totalPages - 1);
  const slice = creditCards.slice(safePage * CARDS_PER_PAGE, (safePage + 1) * CARDS_PER_PAGE);

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!canPaginate) return;
    const d = e.changedTouches[0].clientX - touchStart.current;
    if (d < -SWIPE_THRESHOLD) setPage((p) => Math.min(p + 1, totalPages - 1));
    else if (d > SWIPE_THRESHOLD) setPage((p) => Math.max(p - 1, 0));
  };

  return (
    <div className="rounded-2xl bg-surface-500 border border-neutral-300 p-space-16 md:p-space-24">
      {/* Header: ícone, título; direita: < > (se >3 cartões) e + */}
      <div className="flex items-center justify-between gap-space-12 mb-space-16">
        <div className="flex items-center gap-space-8">
          <span className="flex items-center justify-center w-9 h-9 text-icon-default">
            <IconCard className="w-5 h-5" />
          </span>
          <h2 className="text-heading-xsmall font-heading text-neutral-1100">Cartões & Contas</h2>
        </div>
        <div className="flex items-center gap-space-4">
          {canPaginate && (
            <>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                className="w-9 h-9 rounded-full border border-neutral-300 bg-surface-500 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página anterior"
              >
                <IconChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={safePage >= totalPages - 1}
                className="w-9 h-9 rounded-full border border-neutral-300 bg-surface-500 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Próxima página"
              >
                <IconChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setNewModalOpen(true)}
            className="w-9 h-9 rounded-full border border-neutral-300 bg-surface-500 flex items-center justify-center text-neutral-600 hover:bg-neutral-200 transition-colors"
            aria-label="Novo cartão"
          >
            <IconPlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lista de itens (sem gap; separação por borda) */}
      <div
        className="flex flex-col"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slice.map((card) => (
          <CreditCardRow
            key={card.id}
            card={card}
            onPress={() => setDetailsCard(card)}
          />
        ))}
      </div>

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

function CreditCardRow({ card, onPress }: { card: CreditCard; onPress: () => void }) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="w-full border-b border-neutral-200 py-space-12 text-left last:border-b-0 flex flex-col gap-space-8 hover:bg-neutral-200/50 transition-colors duration-200"
    >
      {/* Linha 1: imagem do banco (altura do texto) + nome do banco à esquerda; •••• 0000 à direita */}
      <div className="flex w-full items-center justify-between gap-space-8">
        <div className="flex min-w-0 items-center gap-space-8">
          <span
            className={`flex h-4 w-4 flex-shrink-0 rounded-sm items-center justify-center ${THEME_BG[card.theme]} ${THEME_ICON[card.theme]}`}
          >
            <IconCard className="w-3 h-3" />
          </span>
          <span className="truncate text-label-xsmall font-label text-neutral-600">{card.name}</span>
        </div>
        <span className="flex-shrink-0 text-label-xsmall text-neutral-600">
          •••• {card.lastDigits || '0000'}
        </span>
      </div>

      {/* Linha 2: valor em negrito */}
      <p className="text-heading-xsmall font-heading text-neutral-1100">
        {formatCurrency(card.currentBill)}
      </p>

      {/* Linha 3: data de vencimento */}
      <p className="text-paragraph-small text-neutral-600">Vence dia {card.dueDay}</p>
    </button>
  );
}

function IconCard({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
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
function IconChevronLeft({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="m15 18-6-6 6-6" /></svg>;
}
function IconChevronRight({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="m9 18 6-6-6-6" /></svg>;
}
