import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { useAssinaturaStore } from '@/features/assinatura/store/assinaturaStore';
import { Lock, CreditCard, ChevronRight, Zap } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';

export default function LicencaExpiradaPage() {
  const navigate = useNavigate();
  const { licenca } = useAssinaturaStore();

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 items-center justify-center text-center space-y-12">
       <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="h-28 w-28 rounded-[2.5rem] bg-foreground text-background flex items-center justify-center relative shadow-2xl">
             <Lock size={48} className="animate-in zoom-in-50 duration-500" />
          </div>
          <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg border-4 border-background">
             <Zap size={18} />
          </div>
       </div>

       <div className="space-y-4 max-w-xs">
          <h1 className="text-4xl font-black font-display tracking-tighter text-foreground leading-none">
             Acesso <br/> <span className="text-primary italic">Suspenso.</span>
          </h1>
          <p className="text-[11px] font-medium text-foreground/50 leading-relaxed uppercase tracking-widest">
             Seu período de teste de 7 dias chegou ao fim. Assine agora para desbloquear todas as funcionalidades e continuar emitindo suas notas com IA.
          </p>
       </div>

       <Card className="w-full p-8 bg-card border-none shadow-xl shadow-black/5 rounded-[2rem] space-y-6">
          <div className="flex items-center justify-between px-2">
             <div className="text-left">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Expira em</p>
                <p className="text-sm font-black text-foreground">{licenca?.trialExpiraEm ? new Date(licenca.trialExpiraEm).toLocaleDateString() : '--/--/----'}</p>
             </div>
             <div className="h-10 px-4 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center text-[9px] font-black uppercase tracking-widest">
                Expirada
             </div>
          </div>
          
          <Button 
             onClick={() => navigate('/config/plano')}
             className="w-full h-16 rounded-2xl shadow-2xl shadow-primary/30 flex items-center justify-between px-8 group overflow-hidden"
          >
             <div className="flex items-center gap-3">
                <CreditCard size={20} />
                <span className="font-black uppercase tracking-[0.2em] text-[10px]">Ver Planos de Assinatura</span>
             </div>
             <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
       </Card>

       <button 
          onClick={() => navigate('/auth/login')}
          className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] hover:text-foreground transition-colors"
       >
          Sair da Conta
       </button>
    </div>
  );
}
