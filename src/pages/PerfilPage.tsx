import { useCallback, useEffect, useState } from 'react';
import { useFinance } from '@/contexts';
import { AddMemberModal } from '@/components/dashboard';

function formatCurrency(v: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
}

type TabId = 'info' | 'config';

export function PerfilPage() {
  const { familyMembers, addFamilyMember, clearAllData, transactions, goals, creditCards, bankAccounts } = useFinance();
  const [tab, setTab] = useState<TabId>('info');
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  // Config: toggles (apenas estado visual)
  const [notifVencimento, setNotifVencimento] = useState(true);
  const [notifLimite, setNotifLimite] = useState(true);
  const [notifResumo, setNotifResumo] = useState(false);
  const [notifObjetivos, setNotifObjetivos] = useState(true);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const user = familyMembers[0] ?? null;
  const onMemberAdded = useCallback(() => setToast('Membro adicionado com sucesso!'), []);

  const exportData = (format: 'json' | 'csv') => {
    const data = { transactions, goals, creditCards, bankAccounts, familyMembers };
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mycash-dados.json';
      a.click();
      URL.revokeObjectURL(a.href);
    } else {
      const rows = [['Tipo', 'Dados'].join(';'), ['transactions', JSON.stringify(transactions)].join(';'), ['goals', JSON.stringify(goals)].join(';'), ['creditCards', JSON.stringify(creditCards)].join(';'), ['bankAccounts', JSON.stringify(bankAccounts)].join(';'), ['familyMembers', JSON.stringify(familyMembers)].join(';')];
      const blob = new Blob(['\ufeff' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'mycash-dados.csv';
      a.click();
      URL.revokeObjectURL(a.href);
    }
  };

  const handleClearAll = () => {
    if (!confirmClear) { setConfirmClear(true); return; }
    clearAllData();
    setConfirmClear(false);
    setToast('Dados foram limpos.');
  };

  return (
    <main className="w-full px-4 pb-8 pt-8 md:px-6 lg:px-8">
      {/* Abas */}
      <div className="flex gap-space-24 border-b border-neutral-300">
        <button type="button" onClick={() => setTab('info')} className={`pb-space-12 text-label-medium font-label ${tab === 'info' ? 'border-b-2 border-secondary-900 text-neutral-1100' : 'text-neutral-600'}`}>Informações</button>
        <button type="button" onClick={() => setTab('config')} className={`pb-space-12 text-label-medium font-label ${tab === 'config' ? 'border-b-2 border-secondary-900 text-neutral-1100' : 'text-neutral-600'}`}>Configurações</button>
      </div>

      {tab === 'info' && (
        <div className="mt-space-24 flex flex-col gap-space-24">
          {/* Card perfil */}
          <div className="rounded-shape-16 border border-neutral-300 bg-surface-500 p-space-24">
            <div className="flex flex-col items-start gap-space-16 sm:flex-row sm:items-center">
              <span className="flex h-[120px] w-[120px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-400 text-heading-large font-heading text-neutral-0">
                {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : (user?.name?.charAt(0) ?? '?')}
              </span>
              <div>
                <h2 className="text-heading-xsmall font-heading text-neutral-1100">{user?.name ?? '—'}</h2>
                <p className="text-paragraph-small text-neutral-600">{user?.role ?? '—'}</p>
                <p className="text-paragraph-small text-neutral-600">{user?.email ?? '—'}</p>
                <p className="text-paragraph-small text-neutral-600">Renda: {user ? formatCurrency(user.monthlyIncome) : '—'}</p>
                <button type="button" className="mt-space-8 text-label-small text-brand-600 hover:underline">Editar Perfil</button>
              </div>
            </div>
          </div>

          {/* Membros da Família */}
          <div className="rounded-shape-16 border border-neutral-300 bg-surface-500 p-space-24">
            <h3 className="text-heading-xsmall font-heading text-neutral-1100 mb-space-16">Membros da Família</h3>
            {familyMembers.length <= 1 ? (
              <div className="rounded-shape-16 bg-neutral-200/50 p-space-24 text-center">
                <p className="text-paragraph-small text-neutral-600 mb-space-12">Você é o único membro cadastrado.</p>
                <button type="button" onClick={() => setAddMemberOpen(true)} className="rounded-shape-100 bg-secondary-900 px-space-24 py-space-12 text-label-small font-label text-neutral-0 hover:bg-neutral-1100">Adicionar Membro da Família</button>
              </div>
            ) : (
              <div className="flex flex-col gap-space-8">
                {familyMembers.map((m) => (
                  <button key={m.id} type="button" className="flex items-center gap-space-12 rounded-shape-16 bg-neutral-200/50 p-space-12 text-left transition-colors hover:bg-neutral-200">
                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-400 text-label-small text-neutral-0">{m.avatarUrl ? <img src={m.avatarUrl} alt="" className="h-full w-full object-cover" /> : m.name.charAt(0)}</span>
                    <div>
                      <p className="text-label-medium font-label text-neutral-1100">{m.name}</p>
                      <p className="text-paragraph-xsmall text-neutral-600">{m.role} · {formatCurrency(m.monthlyIncome)}</p>
                    </div>
                  </button>
                ))}
                <button type="button" onClick={() => setAddMemberOpen(true)} className="mt-space-8 rounded-shape-100 border border-neutral-300 bg-transparent px-space-16 py-space-8 text-label-small text-neutral-1100 hover:bg-neutral-200">Adicionar Membro da Família</button>
              </div>
            )}
          </div>

          <button type="button" className="flex w-full items-center justify-center gap-space-8 rounded-shape-16 bg-red-600 py-space-12 text-label-medium font-label text-neutral-0 hover:bg-red-700 sm:w-auto sm:max-w-xs">
            <IconLogout className="h-5 w-5" />
            Sair
          </button>
        </div>
      )}

      {tab === 'config' && (
        <div className="mt-space-24 grid gap-space-24 md:grid-cols-2">
          {/* Preferências */}
          <div className="rounded-shape-16 border border-neutral-300 bg-surface-500 p-space-24">
            <h3 className="text-heading-xsmall font-heading text-neutral-1100 mb-space-16">Preferências de Exibição</h3>
            <div className="flex flex-col gap-space-12">
              <label className="flex items-center justify-between"><span className="text-paragraph-small text-neutral-600">Modo Escuro</span><span className="text-paragraph-xsmall text-neutral-500">Em breve</span></label>
              <label className="flex flex-col gap-space-4"><span className="text-label-xsmall text-neutral-600">Moeda</span><select className="h-10 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12" defaultValue="BRL"><option value="BRL">Real (R$)</option></select></label>
              <label className="flex flex-col gap-space-4"><span className="text-label-xsmall text-neutral-600">Formato de data</span><select className="h-10 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12" defaultValue="DD/MM/AAAA"><option value="DD/MM/AAAA">DD/MM/AAAA</option></select></label>
            </div>
          </div>

          {/* Notificações */}
          <div className="rounded-shape-16 border border-neutral-300 bg-surface-500 p-space-24">
            <h3 className="text-heading-xsmall font-heading text-neutral-1100 mb-space-16">Notificações</h3>
            <div className="flex flex-col gap-space-12">
              <label className="flex items-center justify-between cursor-pointer"><span className="text-paragraph-small">Lembrete vencimento</span><input type="checkbox" checked={notifVencimento} onChange={(e) => setNotifVencimento(e.target.checked)} className="h-5 w-5 rounded text-brand-600" /></label>
              <label className="flex items-center justify-between cursor-pointer"><span className="text-paragraph-small">Alerta limite</span><input type="checkbox" checked={notifLimite} onChange={(e) => setNotifLimite(e.target.checked)} className="h-5 w-5 rounded text-brand-600" /></label>
              <label className="flex items-center justify-between cursor-pointer"><span className="text-paragraph-small">Resumo por e-mail</span><input type="checkbox" checked={notifResumo} onChange={(e) => setNotifResumo(e.target.checked)} className="h-5 w-5 rounded text-brand-600" /></label>
              <label className="flex items-center justify-between cursor-pointer"><span className="text-paragraph-small">Objetivos alcançados</span><input type="checkbox" checked={notifObjetivos} onChange={(e) => setNotifObjetivos(e.target.checked)} className="h-5 w-5 rounded text-brand-600" /></label>
            </div>
          </div>

          {/* Gerenciar Categorias */}
          <div className="rounded-shape-16 border border-neutral-300 bg-surface-500 p-space-24 md:col-span-2">
            <h3 className="text-heading-xsmall font-heading text-neutral-1100 mb-space-16">Gerenciar Categorias</h3>
            <div className="grid gap-space-16 sm:grid-cols-2">
              <div><p className="text-label-xsmall text-neutral-600 mb-space-8">Receita</p><ul className="flex flex-wrap gap-space-8"><li className="rounded-shape-100 bg-neutral-200 px-space-12 py-space-4 text-paragraph-small">Salário</li><li className="rounded-shape-100 bg-neutral-200 px-space-12 py-space-4 text-paragraph-small">Bônus</li><li className="rounded-shape-100 bg-neutral-200 px-space-12 py-space-4 text-paragraph-small">Investimentos</li><li className="rounded-shape-100 bg-neutral-200 px-space-12 py-space-4 text-paragraph-small">Outros</li></ul><button type="button" className="mt-space-8 text-label-small text-brand-600 hover:underline">Adicionar Categoria</button></div>
              <div><p className="text-label-xsmall text-neutral-600 mb-space-8">Despesa</p><ul className="flex flex-wrap gap-space-8"><li className="rounded-shape-100 bg-neutral-200 px-space-12 py-space-4 text-paragraph-small">Alimentação</li><li className="rounded-shape-100 bg-neutral-200 px-space-12 py-space-4 text-paragraph-small">Transporte</li><li className="rounded-shape-100 bg-neutral-200 px-space-12 py-space-4 text-paragraph-small">Moradia</li><li className="rounded-shape-100 bg-neutral-200 px-space-12 py-space-4 text-paragraph-small">Outros</li></ul><button type="button" className="mt-space-8 text-label-small text-brand-600 hover:underline">Adicionar Categoria</button></div>
            </div>
          </div>

          {/* Dados e Privacidade */}
          <div className="rounded-shape-16 border border-neutral-300 bg-surface-500 p-space-24 md:col-span-2">
            <h3 className="text-heading-xsmall font-heading text-neutral-1100 mb-space-16">Dados e Privacidade</h3>
            <div className="flex flex-wrap gap-space-12"><button type="button" onClick={() => exportData('json')} className="rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-16 py-space-8 text-label-small hover:bg-neutral-200">Exportar JSON</button><button type="button" onClick={() => exportData('csv')} className="rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-16 py-space-8 text-label-small hover:bg-neutral-200">Exportar CSV</button></div>
            <div className="mt-space-16"><button type="button" onClick={handleClearAll} className={`rounded-shape-16 px-space-16 py-space-8 text-label-small ${confirmClear ? 'bg-red-600 text-neutral-0' : 'border border-red-600 text-red-600 hover:bg-red-300/20'}`}>{confirmClear ? 'Clique novamente para confirmar' : 'Limpar Todos os Dados'}</button><p className="mt-space-8 text-paragraph-xsmall text-neutral-500">Esta ação não pode ser desfeita.</p></div>
          </div>

          {/* Sobre */}
          <div className="rounded-shape-16 border border-neutral-300 bg-surface-500 p-space-24 md:col-span-2">
            <h3 className="text-heading-xsmall font-heading text-neutral-1100 mb-space-16">Sobre o mycash+</h3>
            <p className="text-paragraph-small text-neutral-600">Versão v1.0.0</p>
            <p className="mt-space-8 text-paragraph-small text-neutral-600">Controle suas finanças em família de forma simples.</p>
            <div className="mt-space-12 flex gap-space-16"><a href="#" className="text-label-small text-brand-600 hover:underline">Termos de Uso</a><a href="#" className="text-label-small text-brand-600 hover:underline">Política de Privacidade</a></div>
          </div>
        </div>
      )}

      {addMemberOpen && (
        <AddMemberModal onClose={() => setAddMemberOpen(false)} onAdd={(d) => { addFamilyMember(d); setAddMemberOpen(false); }} onSuccess={onMemberAdded} />
      )}

      {toast && <div className="fixed bottom-6 right-6 z-[100] rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-16 py-space-12 text-paragraph-small text-neutral-1100 shadow-lg" role="status">{toast}</div>}
    </main>
  );
}

function IconLogout({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
}
