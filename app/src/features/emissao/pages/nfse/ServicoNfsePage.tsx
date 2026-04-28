import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';
import { useServicosStore } from '@/features/servicos/store/servicosStore';
import { useEmissaoStore } from '../../store/emissaoStore';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { Info, ChevronLeft, Sparkles, ArrowRight, Briefcase } from 'lucide-react';

export default function ServicoNfsePage() {
  const navigate = useNavigate();
  const { servicos, isLoading, fetchServicos } = useServicosStore();
  const { setServicoId: setStoreServicoId, setValorServico, setNaturezaOperacao } = useEmissaoStore();
  
  const [servicoId, setServicoId] = useState('');
  const [valor, setValor] = useState('');

  useEffect(() => {
    fetchServicos();
  }, [fetchServicos]);

  const prosseguir = () => {
    if (!servicoId || !valor) return;
    
    setStoreServicoId(servicoId);
    setValorServico(Number(valor));
    setNaturezaOperacao('Prestação de Serviço');
    navigate('/emissao/nfse/revisao');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 space-y-8 pb-32">
      {/* Header & Progress */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="h-12 w-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-foreground active:scale-90 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-1">
             <div className="h-1.5 w-4 rounded-full bg-primary/30"></div>
             <div className="h-1.5 w-8 rounded-full bg-primary"></div>
             <div className="h-1.5 w-4 rounded-full bg-muted/40"></div>
             <div className="h-1.5 w-4 rounded-full bg-muted/40"></div>
          </div>
          <div className="w-12 h-12"></div>
        </div>

        <div>
           <h1 className="text-3xl font-black font-display tracking-tighter text-foreground leading-tight">Combine o <br/> <span className="text-primary italic">serviço prestado.</span></h1>
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Passo 02: Detalhamento da operação</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Selecione o Serviço</label>
          {isLoading ? (
            <div className="flex justify-center py-8"><LoadingSpinner /></div>
          ) : (
            <div className="space-y-3">
              {servicos.map(s => (
                <div 
                  key={s.id}
                  onClick={() => setServicoId(s.id)}
                  className={`p-5 rounded-[1.5rem] cursor-pointer transition-all active:scale-[0.98] border-2 flex items-center justify-between ${servicoId === s.id ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' : 'bg-card border-transparent shadow-sm'}`}
                >
                  <div className="flex items-center gap-4">
                     <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${servicoId === s.id ? 'bg-primary text-white' : 'bg-muted/50 text-muted-foreground/40'}`}>
                        <Briefcase size={20} />
                     </div>
                     <div>
                        <span className={`font-black text-xs uppercase tracking-tight ${servicoId === s.id ? 'text-foreground' : 'text-foreground/70'}`}>{s.nome}</span>
                        <p className="text-[9px] font-bold text-muted-foreground/60 mt-0.5 italic">ISSQN: {Number(s.aliquotaISSQN).toFixed(2)}%</p>
                     </div>
                  </div>
                  <span className="text-[9px] font-black text-muted-foreground/40 bg-muted/30 px-2.5 py-1 rounded-lg uppercase tracking-tighter">{s.codigoLC116 || '00.00'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Card className="p-8 bg-card border-none shadow-2xl shadow-black/5 rounded-[2.5rem] space-y-6">
           <Input 
              label="Valor da Operação (R$)"
              type="number"
              placeholder="0,00"
              value={valor}
              onChange={e => setValor(e.target.value)}
              className="text-xl font-black h-16 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20"
           />
           <div className="flex items-start gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <Info size={18} className="text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-primary/70 leading-relaxed font-bold uppercase tracking-widest italic">
                Base de cálculo do ISSQN conforme LC 116/2003.
              </p>
           </div>
        </Card>

        {/* Action Button */}
        <div className="fixed bottom-8 left-6 right-6 z-50">
          <Button 
            onClick={prosseguir} 
            disabled={!servicoId || !valor}
            className="w-full h-16 rounded-2xl shadow-2xl shadow-primary/20 flex items-center justify-between px-8 group overflow-hidden"
          >
             <div className="flex items-center gap-3">
                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="font-black uppercase tracking-[0.2em] text-[10px]">Análise Inteligente</span>
             </div>
             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
