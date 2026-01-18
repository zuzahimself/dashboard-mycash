import { useCallback, useEffect, useState } from 'react';
import { NewTransactionModalFull, TransactionsView } from '@/components/dashboard';

export function TransacoesPage() {
  const [newTxOpen, setNewTxOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const onTxSuccess = useCallback(() => setToast('Transação registrada com sucesso!'), []);

  return (
    <main className="w-full px-4 pb-8 pt-8 md:px-6 lg:px-8">
      <TransactionsView onNewTransaction={() => setNewTxOpen(true)} />

      {newTxOpen && (
        <NewTransactionModalFull
          onClose={() => setNewTxOpen(false)}
          onSuccess={onTxSuccess}
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
