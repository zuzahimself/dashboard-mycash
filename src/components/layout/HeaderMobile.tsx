import { useState } from 'react';
import { MenuDropdown } from './MenuDropdown';

export function HeaderMobile() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between h-14 px-space-16 bg-surface-500 border-b border-neutral-300"
        aria-label="Navegação mobile"
      >
        <img src="/logo-full.svg" alt="Mycash+" className="h-5 w-auto flex-shrink-0" />
        <button
          type="button"
          onClick={() => setDropdownOpen(true)}
          className="w-9 h-9 rounded-full bg-neutral-600 flex items-center justify-center flex-shrink-0 overflow-hidden"
          aria-label="Abrir menu"
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
        >
          <IconUser className="w-4 h-4 text-neutral-0" />
        </button>
      </header>
      <MenuDropdown
        isOpen={dropdownOpen}
        onClose={() => setDropdownOpen(false)}
        onLogout={() => { /* TODO: implementar logout */ }}
      />
    </>
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
