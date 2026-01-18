import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/constants';

interface MenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

const navItems = [
  { to: ROUTES.DASHBOARD, label: 'Home', icon: <IconHome /> },
  { to: ROUTES.OBJETIVOS, label: 'Objetivos', icon: <IconTarget /> },
  { to: ROUTES.CARTOES, label: 'Cartões', icon: <IconCard /> },
  { to: ROUTES.TRANSACOES, label: 'Transações', icon: <IconList /> },
  { to: ROUTES.PERFIL, label: 'Perfil', icon: <IconUser /> },
];

export function MenuDropdown({ isOpen, onClose, onLogout }: MenuDropdownProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReady(false);
      const t = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
      return () => cancelAnimationFrame(t);
    } else {
      setReady(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', onEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
    >
      {/* Overlay — toque fora fecha */}
      <div
        className={`absolute inset-0 bg-secondary-900/60 transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel — desliza de cima; não fullscreen */}
      <div
        className={`relative z-10 bg-surface-500 rounded-b-shape-16 shadow-lg max-h-[70vh] overflow-y-auto transition-transform duration-300 ease-out ${ready ? 'translate-y-0' : '-translate-y-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior com X */}
        <div className="flex items-center justify-end px-space-16 py-space-12 border-b border-neutral-300">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="w-8 h-8 rounded-full flex items-center justify-center text-icon-default hover:bg-neutral-200 transition-colors"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>
        {/* Itens de navegação — mesmo padrão da Sidebar: ativo bg secondary-900, ícone brand-600, texto neutral-0 */}
        <nav className="p-space-12 flex flex-col gap-space-4">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-space-12 rounded-shape-16 px-space-12 py-space-12 min-h-[44px] transition-colors ${
                  isActive ? 'bg-secondary-900' : 'hover:bg-neutral-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex-shrink-0 w-5 h-5 flex items-center justify-center ${
                      isActive ? 'text-brand-600' : 'text-neutral-600'
                    }`}
                  >
                    {icon}
                  </span>
                  <span className={`text-label-medium font-label ${isActive ? 'text-neutral-0' : 'text-neutral-600'}`}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        {/* Sair — botão vermelho */}
        <div className="p-space-12 pt-space-4 border-t border-neutral-300">
          <button
            type="button"
            onClick={() => { onClose(); onLogout?.(); }}
            className="w-full flex items-center justify-center gap-space-8 rounded-shape-16 px-space-12 py-space-12 min-h-[44px] bg-red-600 text-neutral-0 text-label-medium font-label hover:bg-red-600/90 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function IconCard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function IconList() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
