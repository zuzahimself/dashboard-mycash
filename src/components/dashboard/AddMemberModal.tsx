import { useRef, useState } from 'react';

const ROLES = ['Pai', 'Mãe', 'Filho', 'Filha', 'Avô', 'Avó', 'Tio', 'Tia'] as const;
const MAX_AVATAR_MB = 5;
const ACCEPT_AVATAR = 'image/jpeg,image/png';

function parseRenda(v: string): number {
  return parseFloat(String(v).replace(/\./g, '').replace(',', '.')) || 0;
}

export interface AddMemberFormData {
  name: string;
  role: string;
  avatarUrl?: string;
  monthlyIncome: number;
}

interface AddMemberModalProps {
  onClose: () => void;
  onAdd: (d: AddMemberFormData) => void;
  onSuccess?: () => void;
}

export function AddMemberModal({ onClose, onAdd, onSuccess }: AddMemberModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatarTab, setAvatarTab] = useState<'url' | 'upload'>('url');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarUpload, setAvatarUpload] = useState<string | null>(null);
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resolveAvatarUrl = (): string | undefined => {
    if (avatarTab === 'url' && avatarUrl.trim()) return avatarUrl.trim();
    if (avatarTab === 'upload' && avatarUpload) return avatarUpload;
    return undefined;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ok = f.type === 'image/jpeg' || f.type === 'image/png';
    if (!ok) {
      setErrors((prev) => ({ ...prev, avatar: 'Aceito apenas JPG ou PNG.' }));
      return;
    }
    if (f.size > MAX_AVATAR_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: `Tamanho máximo ${MAX_AVATAR_MB}MB.` }));
      return;
    }
    setErrors((prev) => { const { avatar: _, ...r } = prev; return r; });
    const r = new FileReader();
    r.onload = () => setAvatarUpload(r.result as string);
    r.readAsDataURL(f);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const r = role.trim();
    const e2: Record<string, string> = {};
    if (n.length < 3) e2.name = 'Nome deve ter pelo menos 3 caracteres';
    if (!r) e2.role = 'Selecione a função';
    setErrors(e2);
    if (Object.keys(e2).length) return;

    onAdd({
      name: n,
      role: r,
      avatarUrl: resolveAvatarUrl(),
      monthlyIncome: parseRenda(monthlyIncome),
    });
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Adicionar Membro da Família">
      <div className="absolute inset-0 bg-secondary-900/60" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-shape-16 border border-neutral-300 bg-surface-500 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-space-16 py-space-16">
          <h3 className="text-heading-xsmall font-heading text-neutral-1100">Adicionar Membro da Família</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-shape-16 border border-neutral-300 bg-surface-500 text-neutral-600 transition-colors hover:bg-neutral-200"
            aria-label="Fechar"
          >
            <IconX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-space-16 p-space-16">
          {/* Nome — obrigatório, min 3 */}
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Nome completo</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Maria Silva"
              className={`h-14 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-12 text-paragraph-medium text-neutral-1100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600 ${
                errors.name ? 'border-red-600' : ''
              }`}
            />
            {errors.name && <p className="text-paragraph-xsmall text-red-600">{errors.name}</p>}
          </label>

          {/* Função — combobox com sugestões */}
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Função na família</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`h-14 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-12 text-paragraph-medium text-neutral-1100 focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600 ${
                errors.role ? 'border-red-600' : ''
              }`}
            >
              <option value="">Selecione</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.role && <p className="text-paragraph-xsmall text-red-600">{errors.role}</p>}
          </label>

          {/* Avatar — abas URL e Upload (opcional) */}
          <div className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Avatar (opcional)</span>
            <div className="flex rounded-shape-16 bg-neutral-200 p-space-4">
              <button
                type="button"
                onClick={() => { setAvatarTab('url'); setErrors((prev) => { const { avatar: _, ...r } = prev; return r; }); }}
                className={`flex-1 rounded-shape-16 py-space-8 text-label-small font-label transition-colors ${
                  avatarTab === 'url' ? 'bg-surface-500 text-neutral-1100 shadow shadow-neutral-4' : 'text-neutral-600 hover:text-neutral-1100'
                }`}
              >
                URL
              </button>
              <button
                type="button"
                onClick={() => { setAvatarTab('upload'); setErrors((prev) => { const { avatar: _, ...r } = prev; return r; }); }}
                className={`flex-1 rounded-shape-16 py-space-8 text-label-small font-label transition-colors ${
                  avatarTab === 'upload' ? 'bg-surface-500 text-neutral-1100 shadow shadow-neutral-4' : 'text-neutral-600 hover:text-neutral-1100'
                }`}
              >
                Upload
              </button>
            </div>
            {avatarTab === 'url' && (
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="h-14 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-12 text-paragraph-medium text-neutral-1100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600"
              />
            )}
            {avatarTab === 'upload' && (
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPT_AVATAR}
                  onChange={handleFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-14 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-12 text-left text-paragraph-medium text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40"
                >
                  {avatarUpload ? 'Imagem selecionada' : 'JPG ou PNG, máx. 5MB'}
                </button>
                {errors.avatar && <p className="text-paragraph-xsmall text-red-600">{errors.avatar}</p>}
              </div>
            )}
          </div>

          {/* Renda mensal — opcional, moeda */}
          <label className="flex flex-col gap-space-4">
            <span className="text-label-small text-neutral-1100">Renda mensal (opcional)</span>
            <input
              type="text"
              inputMode="decimal"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              placeholder="0,00"
              className="h-14 rounded-shape-16 border border-neutral-300 bg-surface-500 px-space-12 py-space-12 text-paragraph-medium text-neutral-1100 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40 focus:border-brand-600"
            />
          </label>

          {/* Footer */}
          <div className="flex justify-end gap-space-12 border-t border-neutral-200 pt-space-16">
            <button
              type="button"
              onClick={onClose}
              className="rounded-shape-100 border border-neutral-300 bg-transparent px-space-24 py-space-12 text-label-medium font-label text-neutral-600 transition-colors hover:bg-neutral-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-shape-100 bg-secondary-900 px-space-24 py-space-12 text-label-medium font-label text-neutral-0 transition-colors hover:bg-neutral-1100"
            >
              Adicionar Membro
            </button>
          </div>
        </form>
      </div>
    </div>
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
