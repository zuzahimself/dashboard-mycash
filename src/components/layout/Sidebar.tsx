import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '@/constants';

export const SIDEBAR_WIDTH_EXPANDED = 256;
export const SIDEBAR_WIDTH_COLLAPSED = 80;
const TOOLTIP_DELAY_MS = 350;

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

// Perfil: acesso pelo clique no username/avatar no rodapé (não é item do nav)
const navItems: NavItem[] = [
  { to: ROUTES.DASHBOARD, label: 'Home', icon: <IconHome /> },
  { to: ROUTES.OBJETIVOS, label: 'Objetivos', icon: <IconTarget /> },
  { to: ROUTES.CARTOES, label: 'Cartões', icon: <IconCard /> },
  { to: ROUTES.TRANSACOES, label: 'Transações', icon: <IconList /> },
];

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const [tooltipLabel, setTooltipLabel] = useState<string | null>(null);
  const tooltipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = (label: string) => {
    tooltipTimeout.current = setTimeout(() => setTooltipLabel(label), TOOLTIP_DELAY_MS);
  };

  const hideTooltip = () => {
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
    tooltipTimeout.current = null;
    setTooltipLabel(null);
  };

  useEffect(() => () => { if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current); }, []);

  const width = isExpanded ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED;

  return (
    <aside
      className="fixed top-0 left-0 z-20 flex h-screen flex-col overflow-visible bg-surface-500 transition-[width] duration-300 ease-in-out"
      style={{ width }}
    >
      {/* Logo — logo-full.svg (aberta), logo-icon.svg (fechada) */}
      <div className="relative flex items-center justify-between gap-space-8 px-space-16 py-space-24 min-h-[72px]">
        <div className="flex items-center min-w-0">
          {isExpanded ? (
            <img src="/logo-full.svg" alt="Mycash+" className="flex-shrink-0 h-6 w-auto" />
          ) : (
            <img src="/logo-icon.svg" alt="" className="flex-shrink-0 h-6 w-auto" aria-hidden="true" />
          )}
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label={isExpanded ? 'Recolher menu' : 'Expandir menu'}
          className="flex-shrink-0 w-8 h-8 rounded-full border border-neutral-300 bg-neutral-0 flex items-center justify-center text-icon-default hover:bg-neutral-200 hover:border-neutral-400 transition-colors duration-200 absolute -right-4 top-1/2 -translate-y-1/2 z-10"
        >
          {isExpanded ? <IconChevronLeft /> : <IconChevronRight />}
        </button>
      </div>

      {/* Nav — Figma 2005:2698; min-h-0 + overflow-y-auto para rolagem interna (evita overflow no aside que cortaria o botão) */}
      <nav className="flex-1 min-h-0 overflow-y-auto py-space-16 px-space-12 flex flex-col gap-space-4">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => {
              const base = 'relative flex items-center gap-space-12 px-space-12 py-space-12 transition-colors duration-200 min-h-[44px]';
              const expanded = 'rounded-shape-16';
              const collapsed = 'rounded-full justify-center w-10 h-10 min-h-0';
              const active = isActive ? 'bg-secondary-900' : 'hover:bg-neutral-200';
              const shape = isExpanded ? expanded : collapsed;
              return `${base} ${shape} ${active}`;
            }}
            onMouseEnter={() => !isExpanded && showTooltip(label)}
            onMouseLeave={hideTooltip}
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
                {isExpanded && (
                  <span className={`text-label-medium font-label ${isActive ? 'text-neutral-0' : 'text-neutral-600'}`}>
                    {label}
                  </span>
                )}
                {!isExpanded && tooltipLabel === label && (
                  <div
                    className="absolute left-full ml-space-8 top-1/2 -translate-y-1/2 z-50 px-space-12 py-space-8 rounded-shape-16 bg-neutral-1100 text-neutral-0 text-label-small font-label whitespace-nowrap shadow-lg"
                    role="tooltip"
                  >
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User — Figma 2006:2776: layout vertical; avatar 36px (size ~32–36); space-16 avatar/text; space-8 entre textos; Label/Medium 16, Paragraph/Small 14 */}
      <div className={`relative p-space-16 flex ${isExpanded ? 'flex-col items-stretch' : 'justify-center'}`}>
        <Link
          to={ROUTES.PERFIL}
          className={`no-underline transition-colors rounded-shape-16 hover:bg-neutral-200 ${isExpanded ? 'flex flex-col items-start gap-space-16 w-full' : 'flex w-9 h-9 items-center justify-center rounded-full'}`}
          onMouseEnter={() => !isExpanded && showTooltip('Perfil')}
          onMouseLeave={hideTooltip}
        >
          <div className="w-9 h-9 rounded-full bg-neutral-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <IconUser className="w-4 h-4 text-neutral-0" />
          </div>
          {isExpanded && (
            <div className="flex flex-col gap-space-8 min-w-0 w-full">
              <span className="text-label-medium font-label text-neutral-1100 truncate">username</span>
              <span className="text-paragraph-small font-normal text-neutral-600 truncate">username@email.com</span>
            </div>
          )}
        </Link>
        {!isExpanded && tooltipLabel === 'Perfil' && (
          <div
            className="absolute left-full ml-space-8 top-1/2 -translate-y-1/2 z-50 px-space-12 py-space-8 rounded-shape-16 bg-neutral-1100 text-neutral-0 text-label-small font-label whitespace-nowrap shadow-lg"
            role="tooltip"
          >
            Perfil
          </div>
        )}
      </div>
    </aside>
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

function IconUser({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className ?? 'w-5 h-5'}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
