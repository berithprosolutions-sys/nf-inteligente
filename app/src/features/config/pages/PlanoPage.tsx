import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { useAssinaturaStore } from '@/features/assinatura/store/assinaturaStore';
import { assinaturaService } from '@/features/assinatura/services/assinaturaService';
import { ChevronLeft, Check, Zap, ShieldCheck, Crown, Calendar, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/formatters';

export default function PlanoPage() {
  const navigate = useNavigate();
  const { licenca, fetchLicenca } = useAssinaturaStore();
  const [assinando, setAssinando] = useState<string | null>(null);

  useEffect(() => {
    fetchLicenca();
  }, [fetchLicenca]);

  const handleAssinar = async (plano: 'MENSAL' | 'ANUAL') => {
    setAssinando(plano);
    try {
      const { checkoutUrl } = await assinaturaService.gerarCheckout(plano);
      // Em um app Capacitor, usaríamos Browser.open({ url: checkoutUrl })
      // No web usamos window.open
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Erro ao gerar checkout:', error);
      alert('Erro ao processar assinatura. Tente novamente mais tarde.');
    } finally {
      setAssinando(null);
    }
  };

  const planos = [
    {
      id: 'MENSAL',
      nome: 'Premium Mensal',
      valor: 97.00,
      periodo: 'mês',
      destaque: false,
      icon: <Calendar size={24} />,
      beneficios: [
        'Emissão de NF-e e NFS-e Ilimitada',
        'IA Fiscal Berith 24h',
        'Cofre de Certificados A1',
        'Suporte prioritário',
        'Dashboard de Auditoria'
      ]
    },
    {
      id: 'ANUAL',
      nome: 'Premium Anual',
      valor: 797.00,
      periodo: 'ano',
      destaque: true,
      label: 'Economize 30%',
      icon: <Crown size={24} />,
      beneficios: [
        'Tudo do plano Mensal',
        '2 meses grátis inclusos',
        'Faturamento por BI antecipado',
        'Consultoria de NCM mensal',
        'Acesso antecipado a novos recursos'
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-6">
        <button 
          onClick={() => navigate('/config')}
          className="h-12 w-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-foreground active:scale-90 transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>

        <div>
          <h1 className="text-3xl font-black font-display tracking-tighter text-foreground leading-tight">Sua jornada <br/> <span className="text-primary italic">financeira premium.</span></h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Escolha o plano ideal para seu negócio</p>
        </div>
      </div>

      {/* Trial Status / Active License */}
      {licenca && (
        <Card className={`p-5 border-none rounded-[1.5rem] flex items-center justify-between ${licenca.status === 'TRIAL' ? 'bg-primary/10' : 'bg-emerald-500/10'}`}>
           <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${licenca.status === 'TRIAL' ? 'bg-primary/20 text-primary' : 'bg-emerald-500/20 text-emerald-500'}`}>
                 <Zap size={20} />
              </div>
              <div className="text-left">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status Atual</p>
                 <h3 className="font-black text-xs uppercase tracking-tight">
                    {licenca.status === 'TRIAL' ? `Período de Teste (${licenca.diasRestantesTrial} dias restantes)` : 'Assinatura Ativa'}
                 </h3>
              </div>
           </div>
           {licenca.status === 'ATIVA' && <ShieldCheck size={20} className="text-emerald-500" />}
        </Card>
      )}

      {/* Planos Grid */}
      <div className="space-y-6">
        {planos.map((plano) => (
          <Card 
            key={plano.id} 
            className={`p-8 border-none rounded-[2.5rem] relative overflow-hidden transition-all ${plano.destaque ? 'bg-zinc-950 text-white shadow-2xl shadow-primary/30 scale-[1.02] border border-white/5' : 'bg-card text-foreground shadow-xl shadow-black/5'}`}
          >
            {plano.label && (
              <div className="absolute top-6 right-6 px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-primary/30">
                {plano.label}
              </div>
            )}
            
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${plano.destaque ? 'bg-white/10 text-primary' : 'bg-primary/5 text-primary'}`}>
              {plano.icon}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black uppercase tracking-tight">{plano.nome}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black font-display tracking-tighter">{formatCurrency(plano.valor)}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest opacity-40`}>/ {plano.periodo}</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {plano.beneficios.map((ben, idx) => (
                 <div key={idx} className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${plano.destaque ? 'bg-primary' : 'bg-primary/10 text-primary'}`}>
                       <Check size={12} className={plano.destaque ? 'text-white' : 'text-primary'} />
                    </div>
                    <span className={`text-[11px] font-bold tracking-tight ${plano.destaque ? 'opacity-80' : 'opacity-60'}`}>{ben}</span>
                 </div>
              ))}
            </div>

            <Button 
              onClick={() => handleAssinar(plano.id as 'MENSAL' | 'ANUAL')}
              disabled={assinando !== null || licenca?.status === 'ATIVA'}
              isLoading={assinando === plano.id}
              className={`w-full h-16 mt-10 rounded-2xl uppercase font-black text-[10px] tracking-[0.2em] transition-all shadow-lg ${plano.destaque ? 'bg-primary hover:bg-primary/90 text-white shadow-primary/40 focus:ring-primary/50' : 'bg-foreground text-background shadow-black/20'}`}
            >
              {licenca?.status === 'ATIVA' && licenca.plano === plano.id ? 'Plano Atual' : 'Contratar Agora'}
            </Button>
          </Card>
        ))}
      </div>

      {/* Safety Info */}
      <div className="flex items-center justify-center gap-2 pt-4 opacity-30">
        <CreditCard size={14} />
        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Pagamento Seguro via Asaas</span>
      </div>
    </div>
  );
}
