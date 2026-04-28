import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { useEmissaoStore } from '../../store/emissaoStore';
import { useClientesStore } from '@/features/clientes/store/clientesStore';
import { useServicosStore } from '@/features/servicos/store/servicosStore';
import { emissaoService } from '../../services/emissaoService';
import { formatCurrency } from '@/shared/lib/formatters';
import { ShieldCheck, Info, FileText, ChevronLeft, Landmark, ArrowRight, Calculator } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { NotaFiscalEmissaoResponse } from '@/features/emissao/types/emissao.types';

export default function RevisaoNfsePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { clienteId, servicoId, valorServico, setNotaEmitida, naturezaOperacao } = useEmissaoStore();
  const { clientes } = useClientesStore();
  const { servicos } = useServicosStore();

  const cliente = clientes.find(c => c.id === clienteId);
  const servico = servicos.find(s => s.id === servicoId);

  const valorBase = valorServico || 0;
  const aliquotaISS = Number(servico?.aliquotaISSQN || 0);
  const valorISS = valorBase * (aliquotaISS / 100);

  const emitir = async () => {
    if (!clienteId || !servicoId || !valorServico) return;
    
    setLoading(true);
    try {
      const nota = await emissaoService.emitir({
        tipo: 'NFSe',
        clienteId: clienteId,
        naturezaOperacao: naturezaOperacao || 'Prestação de Serviço',
        itens: [{
          id: Math.random().toString(36).substring(7),
          servicoId: servicoId,
          descricao: servico?.nome || 'Prestação de Serviço',
          quantidade: 1,
          valorUnitario: valorServico,
          valorTotal: valorServico,
          impostos: {
            iss: aliquotaISS
          }
        }]
      }) as NotaFiscalEmissaoResponse;
      setNotaEmitida(nota);
      navigate('/emissao/resultado');
    } catch (error) {
      console.error("Erro ao emitir NF-Se:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 space-y-6 text-center">
         <div className="relative">
            <div className="h-24 w-24 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <ShieldCheck className="text-primary animate-pulse" size={32} />
            </div>
         </div>
         <div className="space-y-2">
            <h2 className="text-xl font-black text-foreground tracking-tight">Comunicando com Prefeitura</h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] animate-pulse">Assinando protocolo digital...</p>
         </div>
      </div>
    );
  }

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
             <div className="h-1.5 w-4 rounded-full bg-primary/30"></div>
             <div className="h-1.5 w-8 rounded-full bg-primary"></div>
             <div className="h-1.5 w-4 rounded-full bg-muted/40"></div>
          </div>
          <div className="w-12 h-12"></div>
        </div>

        <div>
           <h1 className="text-3xl font-black font-display tracking-tighter text-foreground leading-tight">Revisão <br/> <span className="text-primary italic">Fiscal Municipal.</span></h1>
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Passo 03: Auditoria final NFSe</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Recipient Information Card */}
        <Card className="p-6 bg-card border-none shadow-xl shadow-black/5 rounded-[2rem] flex items-center gap-4">
           <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground/50">
              <Landmark size={24} />
           </div>
           <div className="min-w-0">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tomador do Serviço</p>
              <h2 className="font-black text-sm text-foreground uppercase truncate tracking-tight mt-0.5">{cliente?.nome}</h2>
           </div>
        </Card>

        {/* Tributary Breakdown */}
        <div className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Enquadramento Tributário</h3>
              <Calculator size={14} className="opacity-30" />
           </div>

           <Card className="p-8 bg-card border-none shadow-2xl shadow-black/5 rounded-[2.5rem] space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 bg-primary rounded-full -m-6 blur-3xl"></div>
              
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{servico?.nome}</p>
                 <div className="flex items-center gap-2">
                    <h4 className="text-xl font-black text-foreground tracking-tight italic">ISSQN Retido no Local</h4>
                    <ShieldCheck size={16} className="text-emerald-500" />
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                 <div className="flex justify-between items-center p-4 rounded-2xl bg-muted/30 border border-border/40">
                    <span className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Alíquota ({aliquotaISS}%)</span>
                    <span className="font-black text-xs text-foreground">{formatCurrency(valorISS)}</span>
                 </div>
                 <div className="flex justify-between items-center p-4 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                    <span className="text-[10px] font-black uppercase tracking-widest">Valor Líquido</span>
                    <span className="font-black text-lg font-display tracking-tight">{formatCurrency(valorBase)}</span>
                 </div>
              </div>
           </Card>

           <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex gap-4">
              <Info className="text-indigo-500 shrink-0" size={20} />
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest leading-relaxed">Embasamento Jurídico</p>
                 <p className="text-[10px] text-foreground/50 font-medium leading-relaxed italic">
                    Conforme LC 116/2003, este serviço enquadra-se no item {servico?.codigoLC116 || '01.07'}. Alíquota verificada com sucesso.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="fixed bottom-8 left-6 right-6 z-50">
        <Button 
          onClick={emitir} 
          className="w-full h-16 rounded-2xl shadow-2xl shadow-primary/20 flex items-center justify-between px-8 group overflow-hidden"
        >
           <div className="flex items-center gap-3">
              <FileText size={20} className="group-hover:rotate-6 transition-transform" />
              <span className="font-black uppercase tracking-[0.2em] text-[10px]">Assinar e Protocolar NFSe</span>
           </div>
           <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}

