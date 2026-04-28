// FEATURE: Layout
// Responsabilidade: Container principal para rotas protegidas
import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { useAssinaturaStore } from '@/features/assinatura/store/assinaturaStore';

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { licenca, fetchLicenca } = useAssinaturaStore();

  useEffect(() => {
    fetchLicenca();
  }, [fetchLicenca]);

  useEffect(() => {
    // Se a licença estiver expirada ou suspensa, e o usuário não estiver na página de planos ou de bloqueio
    if (licenca && (licenca.status === 'EXPIRADA' || licenca.status === 'SUSPENSA')) {
      if (location.pathname !== '/licenca-expirada' && location.pathname !== '/config/plano') {
        navigate('/licenca-expirada');
      }
    }
  }, [licenca, location.pathname, navigate]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
