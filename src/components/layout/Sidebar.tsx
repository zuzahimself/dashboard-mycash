import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '@/constants';

const SIDEBAR_WIDTH_EXPANDED = 256;
const SIDEBAR_WIDTH_COLLAPSED = 80;
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
      className="h-screen flex-shrink-0 bg-surface-500 flex flex-col overflow-x-visible overflow-y-auto transition-[width] duration-300 ease-in-out relative"
      style={{ width }}
    >
      {/* Logo + Toggle — Figma: sem divider; Label/Large 18/24 600; brand/700 ícone; botão branco, seta icon-default */}
      <div className="relative flex items-center justify-between gap-space-8 px-space-16 py-space-24 min-h-[72px]">
        <div className="flex items-center gap-space-8 min-w-0">
          <IconLogo className="flex-shrink-0 text-brand-700 w-size-24 h-size-24" />
          {isExpanded && (
            <span className="text-label-large font-label text-neutral-1100 truncate">
              Mycash+
            </span>
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

      {/* Nav — Figma 2005:2698: shape/16, space/8+12; ativo bg secondary-900, ícone brand-600, texto neutral-0; inativo neutral-600 */}
      <nav className="flex-1 py-space-16 px-space-12 flex flex-col gap-space-4">
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

      {/* User — Figma 2006:2776: layout vertical (avatar → username → email); space-16 avatar/text, space-4 entre textos; Label/Medium, Paragraph/Small */}
      <div className={`relative p-space-16 flex ${isExpanded ? 'flex-col items-stretch' : 'justify-center'}`}>
        <Link
          to={ROUTES.PERFIL}
          className={`no-underline transition-colors rounded-shape-16 hover:bg-neutral-200 ${isExpanded ? 'flex flex-col items-start gap-space-16 w-full' : 'flex w-10 h-10 items-center justify-center rounded-full'}`}
          onMouseEnter={() => !isExpanded && showTooltip('Perfil')}
          onMouseLeave={hideTooltip}
        >
          <div className="w-10 h-10 rounded-full bg-neutral-600 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <IconUser className="w-5 h-5 text-neutral-0" />
          </div>
          {isExpanded && (
            <div className="flex flex-col gap-space-4 min-w-0 w-full">
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

function IconLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
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
