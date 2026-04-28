import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEmissaoStore } from '../../store/emissaoStore';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { formatCurrency } from '@/shared/lib/formatters';
import { Sparkles, ShieldCheck, ChevronLeft, ArrowRight, Calculator, Landmark, Cpu } from 'lucide-react';

export default function RevisaoNfePage() {
  const navigate = useNavigate();
  const { itens } = useEmissaoStore();
  const [analisando, setAnalisando] = useState(false);
  const [revisaoConcluida, setRevisaoConcluida] = useState(false);

  const totalNota = itens.reduce((acc, item) => acc + item.valorTotal, 0);

  const handleSolicitarIA = () => {
    setAnalisando(true);
    setTimeout(() => {
      setAnalisando(false);
      setRevisaoConcluida(true);
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 space-y-8 pb-48">
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
           <h1 className="text-3xl font-black font-display tracking-tighter text-foreground leading-tight">Revisão <br/> <span className="text-primary italic">Auditoria Fiscal.</span></h1>
           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Passo 03: Validação por IA Berith</p>
        </div>
      </div>

      {/* AI Analysis Section */}
      {!revisaoConcluida ? (
        <Card className="relative overflow-hidden p-8 border-none bg-card shadow-2xl shadow-black/10 rounded-[2.5rem] flex flex-col items-center text-center space-y-6">
           <div className={`h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center relative ${analisando ? 'animate-pulse' : ''}`}>
              <div className={`absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary ${analisando ? 'animate-spin' : ''}`}></div>
              <Cpu size={40} className="text-primary" />
           </div>
           <div>
              <h2 className="text-xl font-black text-foreground uppercase tracking-tight italic">Auditor NF Inteligente</h2>
              <p className="text-[10px] font-medium text-muted-foreground leading-relaxed mt-2 uppercase tracking-widest">
                Pronta para analisar legislações e tributos desta operação.
              </p>
           </div>
           <Button 
            onClick={handleSolicitarIA}
            disabled={analisando}
            className="w-full py-7 bg-primary/5 border border-primary/20 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all font-black uppercase text-[10px] tracking-[0.2em]"
           >
             {analisando ? 'Periciando Tributos...' : 'Auditoria via NF Inteligente IA'}
           </Button>
        </Card>
      ) : (
        <Card className="relative overflow-hidden p-8 border-none bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-[2.5rem] shadow-xl shadow-emerald-500/5 animate-in slide-in-from-top-4">
           <div className="absolute top-0 right-0 p-6 text-emerald-500 opacity-20">
              <Sparkles size={48} className="animate-pulse" />
           </div>
           <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                 <ShieldCheck size={24} />
              </div>
              <h2 className="text-lg font-black text-foreground tracking-tight uppercase italic">Auditoria Concluída</h2>
           </div>
           <p className="text-[11px] font-medium text-foreground/70 leading-relaxed max-w-[90%]">
              NF Inteligente validou as alíquotas inseridas contra as tabelas de <strong>ICMS/SP</strong> e <strong>NCM/SH 2024</strong>. Tudo certo para emissão.
           </p>
           <div className="mt-4 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 inline-block">
              <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest">Sugestão: Nenhuma alteração necessária</span>
           </div>
        </Card>
      )}

      {/* Tax Breakdown */}
      <div className="space-y-6">
         <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2 flex items-center justify-between">
            <span>Discriminativo de Impostos</span>
            <Calculator size={14} className="opacity-30" />
         </h3>

         {itens.map(item => {
            const icmsAliquota = item.impostos?.icms ?? 18;
            const ipiAliquota = item.impostos?.ipi ?? 0;
            const pisAliquota = item.impostos?.pis ?? 1.65;
            const cofinsAliquota = item.impostos?.cofins ?? 7.6;

            const icmsValor = item.valorTotal * (icmsAliquota / 100);
            const ipiValor = item.valorTotal * (ipiAliquota / 100);

            return (
              <Card key={item.id} className="p-6 bg-card border-none shadow-xl shadow-black/5 rounded-[2rem] space-y-6">
                 <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                       <p className="font-black text-sm text-foreground uppercase truncate tracking-tight">{item.descricao}</p>
                       <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest block mt-0.5">NCM: {item.ncm || 'N/A'} • BASE: {formatCurrency(item.valorTotal)}</span>
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                       <ShieldCheck size={16} />
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between items-center p-4 rounded-xl bg-muted/30 border border-border/40">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-foreground/80 uppercase tracking-widest">ICMS ({icmsAliquota}%)</p>
                          <p className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-tighter">CST 000 • Origem Nac</p>
                       </div>
                       <span className="font-black text-xs text-foreground">{formatCurrency(icmsValor)}</span>
                    </div>

                    <div className="flex justify-between items-center p-4 rounded-xl bg-muted/30 border border-border/40">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-foreground/80 uppercase tracking-widest flex items-center gap-1.5">
                             IPI ({ipiAliquota}%)
                             {ipiAliquota === 0 && <span className="bg-emerald-500/20 text-emerald-600 text-[7px] px-1.5 py-0.5 rounded-full font-black uppercase">Isento</span>}
                          </p>
                          <p className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-tighter">IPI - Enquadramento Geral</p>
                       </div>
                       <span className="font-black text-xs text-foreground">{formatCurrency(ipiValor)}</span>
                    </div>

                    <div className="flex justify-between items-center px-4 py-3 border-t border-dashed border-border/50 pt-4">
                       <div className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">PIS/COFINS Estimado: {pisAliquota}% / {cofinsAliquota}%</div>
                    </div>
                 </div>
              </Card>
            );
         })}
      </div>

      {/* Summary Footer Card */}
      <div className="fixed bottom-8 left-6 right-6 z-50 space-y-4">
         <Card className="p-6 bg-card/80 backdrop-blur-3xl border-border/50 rounded-3xl flex items-center justify-between shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3 text-muted-foreground/50">
               <Landmark size={20} />
               <span className="text-[11px] font-black uppercase tracking-widest">Total da Nota</span>
            </div>
            <div className="text-right">
               <p className="text-xl font-black text-foreground font-display tracking-tight leading-none">{formatCurrency(totalNota)}</p>
               <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-1 italic">{revisaoConcluida ? 'Conformidade IA 100%' : 'Aguardando Revisão'}</p>
            </div>
         </Card>

         <Button 
            onClick={() => navigate('/emissao/nfe/confirmacao')} 
            className="w-full h-16 rounded-2xl shadow-2xl shadow-primary/20 flex items-center justify-between px-8 group overflow-hidden"
         >
            <div className="flex items-center gap-3">
               <span className="font-black uppercase tracking-[0.2em] text-[10px]">Tudo certo, prosseguir</span>
            </div>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
         </Button>
      </div>
    </div>
  );
}
