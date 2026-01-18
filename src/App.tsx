import { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { ROUTES } from './constants';
import { Sidebar, HeaderMobile } from './components/layout';
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
        {!isDesktop && <HeaderMobile />}
        <main className={`flex-1 w-full ${!isDesktop ? 'pt-14' : ''}`}>
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
