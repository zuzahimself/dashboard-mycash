import { useState } from 'react';
import type { BankAccount, CreditCard, CreditCardTheme } from '@/types';

function parseCurrency(v: string): number {
  return parseFloat(String(v).replace(/\./g, '').replace(',', '.')) || 0;
}

type ModalType = 'bank' | 'card';
const THEMES: { value: CreditCardTheme; label: string }[] = [
  { value: 'black', label: 'Black' },
  { value: 'lime', label: 'Lime' },
  { value: 'white', label: 'White' },
];

interface AddAccountCardModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  addBankAccount: (a: Omit<BankAccount, 'id'>) => void;
  addCreditCard: (c: Omit<CreditCard, 'id'>) => void;
  familyMembers: { id: string; name: string }[];
  defaultType?: ModalType;
}

export function AddAccountCardModal({
  onClose,
  onSuccess,
  addBankAccount,
  addCreditCard,
  familyMembers,
  defaultType = 'card',
}: AddAccountCardModalProps) {
  const [type, setType] = useState<ModalType>(defaultType);
  const [name, setName] = useState('');
  const [holderId, setHolderId] = useState(familyMembers[0]?.id ?? '');
  // bank
  const [balance, setBalance] = useState('');
  // card
  const [closingDay, setClosingDay] = useState(15);
  const [dueDay, setDueDay] = useState(22);
  const [limit, setLimit] = useState('');
  const [lastDigits, setLastDigits] = useState('');
  const [theme, setTheme] = useState<CreditCardTheme>('black');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    const n = name.trim();
    if (n.length < 3) err.name = 'Nome deve ter pelo menos 3 caracteres';
    if (!holderId) err.holderId = 'Selecione o titular';

    if (type === 'card') {
      const lim = parseCurrency(limit);
      if (lim <= 0) err.limit = 'Limite deve ser maior que zero';
      const dig = lastDigits.replace(/\D/g, '');
      if (dig && dig.length !== 4) err.lastDigits = 'Informe exatamente 4 dígitos';
    }

    setErrors(err);
    if (Object.keys(err).length > 0) return;

    if (type === 'bank') {
      addBankAccount({ name: n, holderId, balance: parseCurrency(balance) });
    } else {
      const dig = lastDigits.replace(/\D/g, '');
      addCreditCard({
        name: n,
        holderId,
        closingDay: Math.min(31, Math.max(1, closingDay)),
        dueDay: Math.min(31, Math.max(1, dueDay)),
        limit: parseCurrency(limit),
        currentBill: 0,
        theme,
        lastDigits: dig.length === 4 ? dig : undefined,
      });
    }
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Adicionar Conta/Cartão">
      <div className="absolute inset-0 bg-secondary-900/60" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-[min(560px,90vw)] rounded-shape-16 border border-neutral-300 bg-surface-500 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-space-16 py-space-16">
          <h3 className="text-heading-xsmall font-heading text-neutral-1100">Adicionar Conta/Cartão</h3>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-shape-16 border border-neutral-300 text-neutral-600 hover:bg-neutral-200" aria-label="Fechar">
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-space-16 p-space-16">
          {/* Toggle Conta | Cartão */}
          <div className="flex rounded-shape-16 bg-neutral-200 p-space-4">
            <button
              type="button"
              onClick={() => setType('bank')}
              className={`flex-1 rounded-shape-16 py-space-8 text-label-small font-label transition-colors ${
                type === 'bank' ? 'bg-secondary-900 text-neutral-0 shadow' : 'bg-transparent text-neutral-600 hover:text-neutral-1100'
              }`}
            >
              Conta Bancária
            </button>
            <button
              type="button"
              onClick={() => setType('card')}
              className={`flex-1 rounded-shape-16 py-space-8 text-label-small font-label transition-colors ${
                type === 'card' ? 'bg-secondary-900 text-neutral-0 shadow' : 'bg-transparent text-neutral-600 hover:text-neutral-1100'
              }`}
            >
              Cartão de Crédito
            </button>
          </div>

          {/* Nome */}
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">{type === 'bank' ? 'Nome da conta' : 'Nome do cartão / Banco'}</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === 'bank' ? 'Ex: Nubank Conta' : 'Ex: Nubank'}
              className={`h-14 rounded-shape-16 border bg-surface-500 px-space-12 text-paragraph-medium text-neutral-1100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40 ${errors.name ? 'border-red-600' : 'border-neutral-300'}`}
            />
            {errors.name && <p className="text-paragraph-xsmall text-red-600">{errors.name}</p>}
          </label>

          {/* Titular */}
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Titular</span>
            <select
              value={holderId}
              onChange={(e) => setHolderId(e.target.value)}
              className={`h-14 rounded-shape-16 border bg-surface-500 px-space-12 text-paragraph-medium text-neutral-1100 focus:outline-none focus:ring-2 focus:ring-brand-600/40 ${errors.holderId ? 'border-red-600' : 'border-neutral-300'}`}
            >
              {familyMembers.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            {errors.holderId && <p className="text-paragraph-xsmall text-red-600">{errors.holderId}</p>}
          </label>

          {type === 'bank' && (
            <label className="flex flex-col gap-space-4">
              <span className="text-label-small text-neutral-1100">Saldo inicial (R$)</span>
              <input
                type="text"
                inputMode="decimal"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0,00"
                className="h-14 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 text-paragraph-medium text-neutral-1100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40"
              />
            </label>
          )}

          {type === 'card' && (
            <>
              <div className="grid grid-cols-2 gap-space-12">
                <label className="flex flex-col gap-space-4">
                  <span className="text-label-small text-neutral-1100">Dia fechamento (1–31)</span>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={closingDay}
                    onChange={(e) => setClosingDay(Math.min(31, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                    className="h-14 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 text-paragraph-medium text-neutral-1100 focus:outline-none focus:ring-2 focus:ring-brand-600/40"
                  />
                </label>
                <label className="flex flex-col gap-space-4">
                  <span className="text-label-small text-neutral-1100">Dia vencimento (1–31)</span>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={dueDay}
                    onChange={(e) => setDueDay(Math.min(31, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                    className="h-14 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 text-paragraph-medium text-neutral-1100 focus:outline-none focus:ring-2 focus:ring-brand-600/40"
                  />
                </label>
              </div>
              <label className="flex flex-col gap-space-4">
                <span className="text-label-small text-neutral-1100">Limite total (R$)</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="0,00"
                  className={`h-14 rounded-shape-16 border bg-surface-500 px-space-12 text-paragraph-medium text-neutral-1100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40 ${errors.limit ? 'border-red-600' : 'border-neutral-300'}`}
                />
                {errors.limit && <p className="text-paragraph-xsmall text-red-600">{errors.limit}</p>}
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
                  className={`h-14 rounded-shape-16 border bg-surface-500 px-space-12 text-paragraph-medium text-neutral-1100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40 ${errors.lastDigits ? 'border-red-600' : 'border-neutral-300'}`}
                />
                {errors.lastDigits && <p className="text-paragraph-xsmall text-red-600">{errors.lastDigits}</p>}
              </label>
              <div className="flex flex-col gap-space-4">
                <span className="text-label-small text-neutral-1100">Tema visual</span>
                <div className="grid grid-cols-3 gap-space-8">
                  {THEMES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTheme(t.value)}
                      className={`flex flex-col items-center justify-center rounded-shape-16 border-2 py-space-12 transition-colors ${
                        theme === t.value ? 'border-brand-600 bg-brand-100/50' : 'border-neutral-300 bg-surface-500 hover:border-neutral-400'
                      }`}
                    >
                      <span className="text-label-small font-label text-neutral-1100">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-space-12 border-t border-neutral-200 pt-space-16">
            <button type="button" onClick={onClose} className="rounded-shape-100 border border-neutral-300 bg-transparent px-space-24 py-space-12 text-label-medium font-label text-neutral-600 hover:bg-neutral-200">
              Cancelar
            </button>
            <button type="submit" className="rounded-shape-100 bg-secondary-900 px-space-24 py-space-12 text-label-medium font-label text-neutral-0 hover:bg-neutral-1100">
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function IconX({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;
}
