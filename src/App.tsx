import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Outlet } from 'react-router-dom';
import { ROUTES } from './constants';
import { Sidebar } from './components/layout';
import { useMediaQuery } from './hooks/useMediaQuery';
import {
  DashboardPage,
  ObjetivosPage,
  CartoesPage,
  TransacoesPage,
  PerfilPage,
} from './pages';

function AppLayout() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="min-h-screen w-full flex">
      {isDesktop && (
        <Sidebar isExpanded={sidebarExpanded} onToggle={() => setSidebarExpanded((s) => !s)} />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        {!isDesktop && (
          <nav className="w-full bg-secondary-900 text-neutral-0 px-4 py-3 flex flex-wrap gap-2">
            <NavLink to={ROUTES.DASHBOARD} className={({ isActive }) => `px-3 py-1.5 rounded-shape-16 text-label-small ${isActive ? 'bg-brand-600 text-secondary-900' : 'hover:bg-neutral-600'}`}>Dashboard</NavLink>
            <NavLink to={ROUTES.OBJETIVOS} className={({ isActive }) => `px-3 py-1.5 rounded-shape-16 text-label-small ${isActive ? 'bg-brand-600 text-secondary-900' : 'hover:bg-neutral-600'}`}>Objetivos</NavLink>
            <NavLink to={ROUTES.CARTOES} className={({ isActive }) => `px-3 py-1.5 rounded-shape-16 text-label-small ${isActive ? 'bg-brand-600 text-secondary-900' : 'hover:bg-neutral-600'}`}>Cartões</NavLink>
            <NavLink to={ROUTES.TRANSACOES} className={({ isActive }) => `px-3 py-1.5 rounded-shape-16 text-label-small ${isActive ? 'bg-brand-600 text-secondary-900' : 'hover:bg-neutral-600'}`}>Transações</NavLink>
            <NavLink to={ROUTES.PERFIL} className={({ isActive }) => `px-3 py-1.5 rounded-shape-16 text-label-small ${isActive ? 'bg-brand-600 text-secondary-900' : 'hover:bg-neutral-600'}`}>Perfil</NavLink>
          </nav>
        )}
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.OBJETIVOS} element={<ObjetivosPage />} />
          <Route path={ROUTES.CARTOES} element={<CartoesPage />} />
          <Route path={ROUTES.TRANSACOES} element={<TransacoesPage />} />
          <Route path={ROUTES.PERFIL} element={<PerfilPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
