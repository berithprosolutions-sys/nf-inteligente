// FEATURE: Layout
// Responsabilidade: Navegação mobile
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, Sparkles } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  // Esconde a navegação durante o fluxo de emissão para evitar conflitos de botões
  if (location.pathname.startsWith('/emissao')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-0 right-0 px-6 z-50">
      <nav className="bg-card/90 backdrop-blur-3xl border border-border/40 flex justify-around items-center p-3 rounded-[2.5rem] shadow-2xl shadow-black/30">
        <Link to="/" className={`flex flex-col items-center p-2 rounded-full transition-all duration-500 ${location.pathname === '/' ? 'text-primary bg-primary/10 px-5' : 'text-muted-foreground'}`}>
          <LayoutDashboard size={location.pathname === '/' ? 18 : 20} className="transition-all" />
          <span className={`text-[8px] font-black uppercase tracking-widest transition-all duration-500 overflow-hidden ${location.pathname === '/' ? 'max-h-4 mt-1 opacity-100' : 'max-h-0 opacity-0'}`}>Painel</span>
        </Link>
        <Link to="/clientes" className={`flex flex-col items-center p-2 rounded-full transition-all duration-500 ${isActive('/clientes') ? 'text-primary bg-primary/10 px-5' : 'text-muted-foreground'}`}>
          <Users size={isActive('/clientes') ? 18 : 20} className="transition-all" />
          <span className={`text-[8px] font-black uppercase tracking-widest transition-all duration-500 overflow-hidden ${isActive('/clientes') ? 'max-h-4 mt-1 opacity-100' : 'max-h-0 opacity-0'}`}>Clientes</span>
        </Link>
        
        {/* Botão de Destaque para Emissão */}
        <Link to="/emissao" className="h-14 w-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/40 -mt-10 border-4 border-background transition-all active:scale-90 hover:scale-110 hover:-rotate-3">
          <FileText size={22} />
        </Link>

        <Link to="/fiscal" className={`flex flex-col items-center p-2 rounded-full transition-all duration-500 ${isActive('/fiscal') ? 'text-accent bg-accent/10 px-5' : 'text-muted-foreground'}`}>
          <Sparkles size={isActive('/fiscal') ? 18 : 20} className="transition-all" />
          <span className={`text-[8px] font-black uppercase tracking-widest transition-all duration-500 overflow-hidden ${isActive('/fiscal') ? 'max-h-4 mt-1 opacity-100' : 'max-h-0 opacity-0'}`}>Consultor</span>
        </Link>
        <Link to="/config" className={`flex flex-col items-center p-2 rounded-full transition-all duration-500 ${isActive('/config') ? 'text-primary bg-primary/10 px-5' : 'text-muted-foreground'}`}>
          <Settings size={isActive('/config') ? 18 : 20} className="transition-all" />
          <span className={`text-[8px] font-black uppercase tracking-widest transition-all duration-500 overflow-hidden ${isActive('/config') ? 'max-h-4 mt-1 opacity-100' : 'max-h-0 opacity-0'}`}>Ajustes</span>
        </Link>
      </nav>
    </div>
  );
}
