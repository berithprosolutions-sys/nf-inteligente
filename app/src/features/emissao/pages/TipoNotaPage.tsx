import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/shared/components/ui/Card';
import { useEmissaoStore } from '../store/emissaoStore';
import { useEffect } from 'react';
import { Package, Briefcase, ChevronRight, Zap, ChevronLeft } from 'lucide-react';

export default function TipoNotaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setClienteId, setTipoNota } = useEmissaoStore();

  useEffect(() => {
    const preId = location.state?.preSelectedClienteId;
    if (preId) {
      setClienteId(preId);
    }
  }, [location.state, setClienteId]);

  const selecionarTipo = (tipo: 'NFe' | 'NFSe') => {
    setTipoNota(tipo);
    const path = tipo === 'NFe' ? '/emissao/nfe/cliente' : '/emissao/nfse/cliente';
    
    if (location.state?.preSelectedClienteId) {
       navigate(tipo === 'NFe' ? '/emissao/nfe/itens' : '/emissao/nfse/servico');
    } else {
       navigate(path);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 space-y-12 pb-32">
       {/* Header with Back Button */}
       <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="h-12 w-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-foreground active:scale-90 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="w-12 h-12"></div>
       </div>

       {/* Top Header Content */}
       <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-14 w-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-2">
             <Zap size={28} className="fill-primary" />
          </div>
          <h1 className="text-4xl font-black font-display tracking-tighter leading-tight text-foreground">
            O que vamos <br/> <span className="text-primary italic">emitir agora?</span>
          </h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] opacity-60 px-8">
            Selecione a natureza da operação fiscal
          </p>
       </div>

       {/* Options Grid */}
       <div className="space-y-6">
          <Card 
            className="relative overflow-hidden p-8 cursor-pointer group active:scale-95 transition-all bg-card border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem]" 
            onClick={() => selecionarTipo('NFe')}
          >
            <div className="absolute top-0 right-0 -m-8 h-40 w-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="relative z-10 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                     <Package size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">NF-e</h2>
                    <p className="text-[10px] font-black text-blue-500/70 uppercase tracking-widest mt-0.5">Mercadorias & Vendas</p>
                  </div>
               </div>
               <div className="h-10 w-10 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                  <ChevronRight size={20} />
               </div>
            </div>
            <p className="mt-6 text-xs text-muted-foreground font-medium leading-relaxed max-w-[85%]">
               Gestão de saída de estoque para circulação estadual de produtos físicos.
            </p>
          </Card>

          <Card 
            className="relative overflow-hidden p-8 cursor-pointer group active:scale-95 transition-all bg-card border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem]" 
            onClick={() => selecionarTipo('NFSe')}
          >
            <div className="absolute top-0 right-0 -m-8 h-40 w-40 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>
            <div className="relative z-10 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-3xl bg-purple-500/10 text-purple-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                     <Briefcase size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">NFS-e</h2>
                    <p className="text-[10px] font-black text-purple-500/70 uppercase tracking-widest mt-0.5">Serviços & Operações</p>
                  </div>
               </div>
               <div className="h-10 w-10 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                  <ChevronRight size={20} />
               </div>
            </div>
            <p className="mt-6 text-xs text-muted-foreground font-medium leading-relaxed max-w-[85%]">
               Faturamento de serviços intelectuais ou manuais reportados à prefeitura municipal.
            </p>
          </Card>
       </div>

       {/* Footer Help */}
       <div className="pt-4 text-center">
          <button className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 hover:text-primary transition-colors py-2 px-6 rounded-full border border-border/10">
             Não sabe qual escolher? Consulte o Consultor Berith IA
          </button>
       </div>
    </div>
  );
}
