import { useState, useRef } from 'react';
import { useFinance } from '@/contexts';
import type { CreditCard, CreditCardTheme } from '@/types';

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

export function CreditCardsWidget() {
  const { creditCards, familyMembers, addCreditCard, deleteCreditCard } = useFinance();
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
        <NewCardModal
          familyMembers={familyMembers}
          onClose={() => setNewModalOpen(false)}
          onAdd={(d) => { addCreditCard(d); setNewModalOpen(false); }}
        />
      )}
      {detailsCard && (
        <CardDetailsModal
          card={detailsCard}
          familyMembers={familyMembers}
          onClose={() => setDetailsCard(null)}
          onDelete={() => { deleteCreditCard(detailsCard.id); setDetailsCard(null); }}
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

function NewCardModal({
  familyMembers,
  onClose,
  onAdd,
}: {
  familyMembers: { id: string; name: string }[];
  onClose: () => void;
  onAdd: (d: {
    name: string;
    holderId: string;
    closingDay: number;
    dueDay: number;
    limit: number;
    currentBill: number;
    theme: CreditCardTheme;
    lastDigits?: string;
  }) => void;
}) {
  const [name, setName] = useState('');
  const [holderId, setHolderId] = useState(familyMembers[0]?.id ?? '');
  const [closingDay, setClosingDay] = useState(15);
  const [dueDay, setDueDay] = useState(22);
  const [limit, setLimit] = useState('');
  const [currentBill, setCurrentBill] = useState('');
  const [theme, setTheme] = useState<CreditCardTheme>('black');
  const [lastDigits, setLastDigits] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const l = parseFloat(String(limit).replace(/\./g, '').replace(',', '.')) || 0;
    const b = parseFloat(String(currentBill).replace(/\./g, '').replace(',', '.')) || 0;
    if (name.trim() && holderId) {
      onAdd({
        name: name.trim(),
        holderId,
        closingDay: Math.min(31, Math.max(1, closingDay)),
        dueDay: Math.min(31, Math.max(1, dueDay)),
        limit: l,
        currentBill: b,
        theme,
        lastDigits: lastDigits.replace(/\D/g, '').slice(-4) || undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-secondary-900/60" onClick={onClose} aria-hidden />
      <div
        className="relative bg-surface-500 rounded-shape-16 shadow-xl p-space-24 w-full max-w-md max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Novo cartão"
      >
        <h3 className="text-heading-xsmall font-heading text-neutral-1100 mb-space-16">Novo cartão</h3>
        <form onSubmit={submit} className="flex flex-col gap-space-12">
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Nome / Banco</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8 text-paragraph-medium"
            />
          </label>
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Titular</span>
            <select
              value={holderId}
              onChange={(e) => setHolderId(e.target.value)}
              className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8"
            >
              {familyMembers.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-space-12">
            <label className="flex flex-col gap-space-4">
              <span className="text-label-small text-neutral-1100">Fechamento (dia)</span>
              <input
                type="number"
                min={1}
                max={31}
                value={closingDay}
                onChange={(e) => setClosingDay(parseInt(e.target.value, 10) || 1)}
                className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8"
              />
            </label>
            <label className="flex flex-col gap-space-4">
              <span className="text-label-small text-neutral-1100">Vencimento (dia)</span>
              <input
                type="number"
                min={1}
                max={31}
                value={dueDay}
                onChange={(e) => setDueDay(parseInt(e.target.value, 10) || 1)}
                className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8"
              />
            </label>
          </div>
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Limite (R$)</span>
            <input
              type="text"
              inputMode="numeric"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="0"
              className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8"
            />
          </label>
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Fatura atual (R$)</span>
            <input
              type="text"
              inputMode="numeric"
              value={currentBill}
              onChange={(e) => setCurrentBill(e.target.value)}
              placeholder="0"
              className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8"
            />
          </label>
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Tema</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as CreditCardTheme)}
              className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8"
            >
              <option value="black">Preto</option>
              <option value="lime">Verde-limão</option>
              <option value="white">Branco</option>
            </select>
          </label>
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Últimos 4 dígitos (opcional)</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={lastDigits}
              onChange={(e) => setLastDigits(e.target.value.replace(/\D/g, ''))}
              placeholder="1234"
              className="rounded-shape-16 border border-neutral-300 px-space-12 py-space-8"
            />
          </label>
          <div className="flex gap-space-8 justify-end mt-space-8">
            <button type="button" onClick={onClose} className="px-4 py-2 text-paragraph-small text-neutral-600">Cancelar</button>
            <button type="submit" className="px-4 py-2 text-label-small font-label text-neutral-0 bg-secondary-900 rounded-shape-16 hover:bg-neutral-1100">Adicionar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CardDetailsModal({
  card,
  familyMembers,
  onClose,
  onDelete,
}: { card: CreditCard; familyMembers: { id: string; name: string }[]; onClose: () => void; onDelete: () => void }) {
  const holder = familyMembers.find((m) => m.id === card.holderId);
  const usage = card.limit > 0 ? Math.round((card.currentBill / card.limit) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-secondary-900/60" onClick={onClose} aria-hidden />
      <div
        className="relative bg-surface-500 rounded-shape-16 shadow-xl p-space-24 w-full max-w-sm"
        role="dialog"
        aria-modal="true"
        aria-label="Detalhes do cartão"
      >
        <h3 className="text-heading-xsmall font-heading text-neutral-1100 mb-space-16">{card.name}</h3>
        <div className="flex flex-col gap-space-8">
          {holder && <p className="text-paragraph-small text-neutral-600">Titular: {holder.name}</p>}
          <p className="text-paragraph-small text-neutral-600">Fatura atual: <strong className="text-neutral-1100">{formatCurrency(card.currentBill)}</strong></p>
          <p className="text-paragraph-small text-neutral-600">Limite: {formatCurrency(card.limit)}</p>
          <p className="text-paragraph-small text-neutral-600">Uso: {usage}%</p>
          <p className="text-paragraph-small text-neutral-600">Fechamento: dia {card.closingDay} · Vencimento: dia {card.dueDay}</p>
          {card.lastDigits && <p className="text-paragraph-small text-neutral-600">•••• {card.lastDigits}</p>}
        </div>
        <div className="flex gap-space-8 justify-end mt-space-24">
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 text-label-small font-label text-red-600 hover:bg-red-300/30 rounded-shape-16"
          >
            Excluir
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 text-label-small font-label text-neutral-0 bg-secondary-900 rounded-shape-16 hover:bg-neutral-1100">Fechar</button>
        </div>
      </div>
    </div>
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
