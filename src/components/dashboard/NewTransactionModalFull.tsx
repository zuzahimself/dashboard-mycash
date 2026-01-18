import { useCallback, useEffect, useState } from 'react';
import { useFinance } from '@/contexts';
import type { Transaction } from '@/types';

const CATEGORIAS_RECEITA = ['Salário', 'Bônus', 'Investimentos', 'Outros'];
const CATEGORIAS_DESPESA = ['Alimentação', 'Transporte', 'Moradia', 'Saúde', 'Educação', 'Lazer', 'Mercado', 'Contas', 'Investimentos', 'Outros'];
const NEW_CATEGORY_VALUE = '__NEW__';

function parseCurrency(v: string): number {
  return parseFloat(String(v).replace(/\./g, '').replace(',', '.')) || 0;
}

interface NewTransactionModalFullProps {
  onClose: () => void;
  onSuccess: () => void;
  /** Quando definido, pré-preenche conta/cartão e força tipo Despesa (ex.: ao clicar em Adicionar Despesa no modal do cartão). */
  initialAccountId?: string;
}

export function NewTransactionModalFull({ onClose, onSuccess, initialAccountId }: NewTransactionModalFullProps) {
  const { addTransaction, bankAccounts, creditCards, familyMembers } = useFinance();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [memberId, setMemberId] = useState<string | null>(null);
  const [accountId, setAccountId] = useState(() => initialAccountId || bankAccounts[0]?.id || creditCards[0]?.id || '');
  const [installments, setInstallments] = useState(1);
  const [isRecurring, setIsRecurring] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isCreditCard = accountId ? creditCards.some((c) => c.id === accountId) : false;
  const showParcelamento = type === 'expense' && isCreditCard;
  const parcelamentoDisabled = isRecurring;

  const categories = type === 'income' ? CATEGORIAS_RECEITA : CATEGORIAS_DESPESA;

  useEffect(() => {
    setCategory('');
    setCustomCategory('');
    if (type === 'income') {
      setIsRecurring(false);
      setInstallments(1);
    }
  }, [type]);

  useEffect(() => {
    if (isRecurring) setInstallments(1);
  }, [isRecurring]);

  const resolveCategory = useCallback((): string => {
    if (category === NEW_CATEGORY_VALUE) return customCategory.trim() || '';
    return category;
  }, [category, customCategory]);

  const validate = useCallback((): boolean => {
    const e: Record<string, string> = {};
    const v = parseCurrency(value);
    if (v <= 0) e.value = 'Valor deve ser maior que zero';
    if (description.trim().length < 3) e.description = 'Descrição deve ter pelo menos 3 caracteres';
    const cat = resolveCategory();
    if (!cat) e.category = 'Selecione ou informe uma categoria';
    if (!accountId) e.accountId = 'Selecione conta ou cartão';
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [value, description, resolveCategory, accountId]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const cat = resolveCategory();
    const v = parseCurrency(value);
    const payload: Omit<Transaction, 'id'> = {
      type,
      value: v,
      description: description.trim(),
      category: cat,
      date,
      accountId,
      memberId,
      installments: showParcelamento ? installments : 1,
      status: 'completed',
      isRecurring: type === 'expense' ? isRecurring : false,
      isPaid: type === 'income',
    };
    addTransaction(payload);
    onSuccess();
    onClose();
  };

  const close = () => {
    setErrors({});
    onClose();
  };

  const accountsForSelect = [
    { group: 'Contas Bancárias', options: bankAccounts.map((a) => ({ id: a.id, name: a.name })) },
    { group: 'Cartões de Crédito', options: creditCards.map((c) => ({ id: c.id, name: `Crédito ${c.name}` })) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex h-full w-full flex-col bg-surface-500" role="dialog" aria-modal="true" aria-label="Nova Transação">
      {/* Header fixo */}
      <header className="flex flex-shrink-0 items-center justify-between gap-space-16 border-b border-neutral-200 px-space-16 py-space-16 md:px-space-24">
        <div className="flex min-w-0 items-center gap-space-16">
          <span
            className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full ${
              type === 'income' ? 'bg-brand-600 text-secondary-900' : 'bg-secondary-900 text-neutral-0'
            }`}
          >
            {type === 'income' ? (
              <IconArrowDownLeft className="h-8 w-8" />
            ) : (
              <IconArrowUpRight className="h-8 w-8" />
            )}
          </span>
          <div>
            <h1 className="text-heading-xsmall font-heading text-neutral-1100">Nova Transação</h1>
            <p className="text-paragraph-small text-neutral-600">
              {type === 'income' ? 'Registrar receita' : 'Registrar despesa'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={close}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-shape-16 border border-neutral-300 bg-surface-500 text-neutral-600 transition-colors hover:bg-neutral-200"
          aria-label="Fechar"
        >
          <IconX className="h-6 w-6" />
        </button>
      </header>

      {/* Conteúdo scrollável — centralizado */}
      <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-space-16 px-space-16 py-space-24 md:px-space-24">
          {/* Toggle Receita | Despesa */}
          <div className="flex rounded-shape-16 bg-neutral-200 p-space-4">
            {(['income', 'expense'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-shape-16 py-space-12 text-label-medium font-label transition-all ${
                  type === t
                    ? 'bg-surface-500 text-neutral-1100 shadow shadow-neutral-4'
                    : 'text-neutral-600 hover:text-neutral-1100'
                }`}
              >
                {t === 'income' ? 'Receita' : 'Despesa'}
              </button>
            ))}
          </div>

          {/* Valor — 56px, R$ fixo */}
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Valor (R$)</span>
            <div className="flex overflow-hidden rounded-shape-16 border border-neutral-300 bg-surface-500">
              <span className="flex h-14 items-center border-r border-neutral-300 bg-surface-500 pl-space-12 text-paragraph-medium text-neutral-600">
                R$
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0,00"
                className={`h-14 flex-1 bg-surface-500 px-space-12 py-space-12 text-paragraph-medium text-neutral-1100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40 ${
                  errors.value ? 'border-red-600' : ''
                }`}
              />
            </div>
            {errors.value && <p className="text-paragraph-xsmall text-red-600">{errors.value}</p>}
          </label>

          {/* Descrição — 56px */}
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Descrição</span>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Supermercado, Salário..."
              className={`h-14 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-12 text-paragraph-medium text-neutral-1100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600 ${
                errors.description ? 'border-red-600' : ''
              }`}
            />
            {errors.description && <p className="text-paragraph-xsmall text-red-600">{errors.description}</p>}
          </label>

          {/* Categoria — dropdown, "+ Nova Categoria" no topo, filtrar por tipo */}
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Categoria</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`h-14 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-12 text-paragraph-medium text-neutral-1100 focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600 ${
                errors.category ? 'border-red-600' : ''
              }`}
            >
              <option value="">Selecione</option>
              <option value={NEW_CATEGORY_VALUE}>+ Nova Categoria</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {category === NEW_CATEGORY_VALUE && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Nome da nova categoria"
                className="mt-2 h-12 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-8 text-paragraph-medium text-neutral-1100 placeholder:text-neutral-600"
              />
            )}
            {errors.category && <p className="text-paragraph-xsmall text-red-600">{errors.category}</p>}
          </label>

          {/* Grid 2 col: Membro (opcional) e Conta/Cartão (obrigatório) */}
          <div className="grid gap-space-16 md:grid-cols-2">
            <label className="flex flex-col gap-space-4">
              <span className="text-label-small text-neutral-1100">Membro (opcional)</span>
              <select
                value={memberId ?? ''}
                onChange={(e) => setMemberId(e.target.value || null)}
                className="h-14 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-12 text-paragraph-medium text-neutral-1100 focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600"
              >
                <option value="">Família (Geral)</option>
                {familyMembers.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-space-4">
              <span className="text-label-small text-neutral-1100">Conta / Cartão</span>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className={`h-14 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-12 text-paragraph-medium text-neutral-1100 focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600 ${
                  errors.accountId ? 'border-red-600' : ''
                }`}
              >
                <option value="">Selecione</option>
                {accountsForSelect.map(({ group, options }) => (
                  <optgroup key={group} label={group}>
                    {options.map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {errors.accountId && <p className="text-paragraph-xsmall text-red-600">{errors.accountId}</p>}
            </label>
          </div>

          {/* Data */}
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Data</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-14 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-12 text-paragraph-medium text-neutral-1100 focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600"
            />
          </label>

          {/* Parcelamento — só se cartão + despesa; 1x–12x; desabilitar se recorrente */}
          {showParcelamento && (
            <label className="flex flex-col gap-space-4">
              <span className="text-label-small text-neutral-1100">Parcelamento</span>
              <select
                value={installments}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  setInstallments(n);
                  if (n > 1) setIsRecurring(false);
                }}
                disabled={parcelamentoDisabled}
                className="h-14 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-12 text-paragraph-medium text-neutral-1100 focus:outline-none focus:ring-2 focus:ring-brand-600/40 disabled:opacity-60 disabled:bg-neutral-200"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}x</option>
                ))}
              </select>
            </label>
          )}

          {/* Checkbox despesa recorrente — só despesa; container azul suave; se parcelas >1 desabilitar e forçar 1x */}
          {type === 'expense' && (
            <div className="rounded-shape-16 bg-[#eff6ff] p-space-16">
              <label className={`flex items-center gap-space-12 ${installments > 1 ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  disabled={installments > 1}
                  className="h-5 w-5 rounded border-neutral-300 text-brand-600 focus:ring-brand-600/40"
                />
                <span className="text-paragraph-medium text-neutral-1100">Despesa recorrente (mensal)</span>
              </label>
              {installments > 1 && (
                <p className="mt-space-8 text-paragraph-xsmall text-neutral-600">
                  Despesas parceladas não podem ser recorrentes.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer fixo */}
        <footer className="flex flex-shrink-0 items-center justify-end gap-space-12 border-t border-neutral-200 bg-surface-500 px-space-16 py-space-16 md:px-space-24">
          <button
            type="button"
            onClick={close}
            className="rounded-shape-100 border border-neutral-300 bg-transparent px-space-24 py-space-12 text-label-medium font-label text-neutral-600 transition-colors hover:bg-neutral-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-shape-100 bg-secondary-900 px-space-24 py-space-12 text-label-medium font-label text-neutral-0 transition-colors hover:bg-neutral-1100"
          >
            Salvar Transação
          </button>
        </footer>
      </form>
    </div>
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

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
