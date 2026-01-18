import { useCallback, useEffect, useState } from 'react';
import { CardsView, NewTransactionModalFull } from '@/components/dashboard';

export function CartoesPage() {
  const [newTxOpen, setNewTxOpen] = useState(false);
  const [addExpenseForAccountId, setAddExpenseForAccountId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const onTxSuccess = useCallback(() => setToast('Transação registrada com sucesso!'), []);
  const onAccountCardAdded = useCallback(() => setToast('Conta/Cartão adicionado com sucesso!'), []);

  return (
    <main className="w-full px-4 pb-8 pt-8 md:px-6 lg:px-8">
      <CardsView
        onAddExpense={(id) => { setAddExpenseForAccountId(id); setNewTxOpen(true); }}
        onAccountCardAdded={onAccountCardAdded}
      />

      {newTxOpen && (
        <NewTransactionModalFull
          onClose={() => { setNewTxOpen(false); setAddExpenseForAccountId(null); }}
          onSuccess={onTxSuccess}
          initialAccountId={addExpenseForAccountId ?? undefined}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-16 py-space-12 text-paragraph-small text-neutral-1100 shadow-lg" role="status">
          {toast}
        </div>
      )}
    </main>
  );
}
