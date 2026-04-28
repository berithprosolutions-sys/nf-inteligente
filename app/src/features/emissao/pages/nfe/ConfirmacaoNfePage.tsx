import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { emissaoService } from '../../services/emissaoService';
import { useEmissaoStore } from '../../store/emissaoStore';
import { SendHorizonal, AlertTriangle, ShieldCheck, ChevronLeft, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';

export default function ConfirmacaoNfePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const transmitir = async () => {
    setErro(null);
    setLoading(true);

    try {
      const { clienteId, itens, naturezaOperacao, tipoNota } = useEmissaoStore.getState();

      if (!clienteId || !tipoNota) {
        setErro('Dados do wizard incompletos. Volte ao início do fluxo.');
        return;
      }

      const nota = await emissaoService.emitir({
        tipo: tipoNota,
        clienteId,
        naturezaOperacao: naturezaOperacao ?? 'Venda de mercadoria',
        itens,
      });

      useEmissaoStore.getState().setNotaEmitida(nota);
      navigate(`/emissao/resultado/${nota.id}`);
    } catch (err: any) {
      setErro(err?.response?.data?.message ?? err?.message ?? 'Erro ao emitir nota. Tente novamente.');
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
               <Zap className="text-primary animate-pulse" size={32} />
            </div>
         </div>
         <div className="space-y-2">
            <h2 className="text-xl font-black text-foreground tracking-tight italic">Sincronizando com SEFAZ</h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] animate-pulse">Aguardando autorização do protocolo...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 space-y-8 pb-32">
      {/* Header */}
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
             <div className="h-1.5 w-4 rounded-full bg-primary/30"></div>
             <div className="h-1.5 w-8 rounded-full bg-primary"></div>
          </div>
          <div className="w-12 h-12"></div>
        </div>

        <div>
           <h1 className="text-3xl font-black font-display tracking-tighter text-foreground leading-tight">Último passo: <br/> <span className="text-primary italic">Autorizar envio.</span></h1>
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Passo 04: Transmissão para Sefaz</p>
        </div>
      </div>

      <div className="space-y-6 flex-1">
         <Card className="p-10 bg-card border-none shadow-2xl shadow-black/5 rounded-[2.5rem] space-y-8 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Zap size={80} />
            </div>
            
            <div className="flex justify-center">
               <div className="h-20 w-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck size={40} />
               </div>
            </div>

            <div className="space-y-4">
               <h2 className="text-xl font-black text-foreground tracking-tight">Tudo Pronto.</h2>
               <p className="text-[11px] font-medium text-foreground/50 leading-relaxed uppercase tracking-widest">
                  A nota foi empacotada no padrão XML SEFAZ, assinada digitalmente com o certificado A1 e aguarda sua autorização final de transmissão.
               </p>
            </div>

            {erro && (
               <div className="flex items-start gap-4 p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive text-left">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{erro}</span>
               </div>
            )}
         </Card>

         <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="h-8 w-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
               <Sparkles size={14} />
            </div>
            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] italic">Segurança Berith: Criptografia de Ponta a Ponta Ativa</p>
         </div>
      </div>

      {/* Primary Action Button */}
      <div className="fixed bottom-8 left-6 right-6 z-50">
        <Button 
          onClick={transmitir} 
          className="w-full h-16 rounded-2xl shadow-2xl shadow-primary/20 flex items-center justify-between px-8 group overflow-hidden"
        >
           <div className="flex items-center gap-3">
              <SendHorizonal size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span className="font-black uppercase tracking-[0.2em] text-[10px]">Transmitir à SEFAZ</span>
           </div>
           <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
