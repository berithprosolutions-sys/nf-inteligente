import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService, DashboardKpis } from '../services/dashboardService';
import { formatCurrency } from '@/shared/lib/formatters';
import { Card } from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { Sparkles, TrendingUp, AlertCircle, ChevronRight, FileCheck, Users, Package, Briefcase } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useEmissaoStore } from '@/features/emissao/store/emissaoStore';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { historicoSessao } = useEmissaoStore();
  const [data, setData] = useState<DashboardKpis | null>(null);

  useEffect(() => {
    dashboardService.getKpis().then(setData);
  }, []);

  const faturamentoSessao = historicoSessao.reduce((acc, nota) => acc + (nota.valorTotal || 0), 0);
  const faturamentoTotal = (data?.faturamentoMes || 0) + faturamentoSessao;
  const totalNotas = (data?.notasEmitidas || 0) + historicoSessao.length;

  return (
    <div className="p-6 space-y-8 pb-24 bg-background min-h-screen">
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-accent p-0.5 shadow-lg shadow-primary/20">
             <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden border-2 border-background">
               <img src="/logo-dark.svg" className="w-full h-full object-contain p-2 dark:hidden" />
               <img src="/logo-light.svg" className="w-full h-full object-contain p-2 hidden dark:block" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Bem-vindo de volta</p>
            <h1 className="text-2xl font-black text-foreground font-display mt-1">{user?.nome?.split(' ')[0] || 'Gestor'}</h1>
          </div>
        </div>
        <button className="h-12 w-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center shadow-sm text-foreground active:scale-90 transition-transform">
           <AlertCircle size={20} className="text-primary" />
        </button>
      </div>

      {!data ? (
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      ) : (
        <>
          <Card 
            onClick={() => navigate('/fiscal')}
            className="group cursor-pointer border-none bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#D946EF] text-white overflow-hidden relative shadow-2xl shadow-primary/30 transform active:scale-[0.98] transition-all p-8 min-h-[220px] flex flex-col justify-between"
          >
            <div className="relative z-10">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md w-fit px-3 py-1.5 rounded-full mb-6 border border-white/20">
                <Sparkles size={14} className="text-white fill-white" />
                <p className="text-[9px] font-black uppercase tracking-widest">Inteligência Fiscal</p>
              </div>
              <p className="text-sm font-medium text-white/80">Economia estimada este mês</p>
              <p className="text-5xl font-black mt-2 font-display tracking-tighter">{formatCurrency(data.economiaIA)}</p>
            </div>

            <div className="relative z-10 flex items-center justify-between mt-4">
               <div className="flex items-center text-[10px] bg-black/20 backdrop-blur-sm px-3 py-2 rounded-xl font-black uppercase tracking-widest">
                 <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 animate-pulse" />
                 Sincronizado com SEFAZ
               </div>
               <ChevronRight className="group-hover:translate-x-2 transition-transform opacity-70" />
            </div>

            {/* Elementos Decorativos */}
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-black/10 rounded-full blur-2xl" />
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card border-none shadow-xl shadow-black/5 p-6 flex flex-col justify-between min-h-[140px]">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                  <TrendingUp size={20} />
                </div>
                <div className="flex items-center gap-1 text-green-500 font-black text-[10px] bg-green-500/10 px-2 py-1 rounded-lg">
                   +12%
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Faturamento</p>
                <p className="text-xl font-black text-foreground mt-1 tracking-tight">{formatCurrency(faturamentoTotal)}</p>
              </div>
            </Card>
            
            <Card className="bg-card border-none shadow-xl shadow-black/5 p-6 flex flex-col justify-between min-h-[140px]">
              <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <FileCheck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">NF Processadas</p>
                <p className="text-xl font-black text-foreground mt-1 tracking-tight">{totalNotas} Docs</p>
              </div>
            </Card>
          </div>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">Gestão Operacional</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Clientes', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', path: '/clientes' },
                { label: 'Produtos', icon: Package, color: 'text-orange-500', bg: 'bg-orange-500/10', path: '/produtos' },
                { label: 'Serviços', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10', path: '/servicos' }
              ].map((item) => (
                <button 
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="bg-card p-5 rounded-[2rem] shadow-xl shadow-black/5 flex flex-col items-center justify-center space-y-3 active:scale-90 transition-all border border-border/20"
                >
                  <div className={`${item.bg} h-12 w-12 rounded-2xl flex items-center justify-center ${item.color} shadow-inner`}>
                    <item.icon size={22} />
                  </div>
                  <span className="text-[10px] font-black text-foreground uppercase tracking-tighter">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center">
                <AlertCircle size={14} className="mr-2 text-destructive"/> Alertas do Fisco
              </h2>
              <button onClick={() => navigate('/alertas-fiscais')} className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Acessar Central</button>
            </div>
            
            <Card 
              onClick={() => navigate('/alertas-fiscais')}
              className="border-none bg-card shadow-xl shadow-black/5 p-6 relative cursor-pointer active:scale-[0.98] transition-transform overflow-hidden group"
            >
              <div className="flex items-center gap-5">
                <div className="h-14 w-1 flex-shrink-0 bg-destructive rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-black text-foreground leading-tight">Feed Diário de Alertas Fiscais</p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-medium">Acompanhe as atualizações tributárias sobre ICMS, SEFAZ, e demais obrigações.</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                  <ChevronRight size={18} />
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

