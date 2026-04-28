import { useNavigate } from 'react-router-dom';
import { useEmissaoStore } from '../../store/emissaoStore';
import { Button } from '@/shared/components/ui/Button';
import { formatCurrency } from '@/shared/lib/formatters';
import { ShieldCheck, FileText, Share2, Download, Home, ChevronRight, CheckCircle2, Landmark, ArrowRight } from 'lucide-react';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Card } from '@/shared/components/ui/Card';

export default function ResultadoPage() {
  const navigate = useNavigate();
  const { notaEmitida, reset } = useEmissaoStore();

  if (!notaEmitida) {
     return (
       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center space-y-6">
         <div className="h-20 w-20 rounded-[2rem] bg-muted/30 flex items-center justify-center text-muted-foreground/30">
            <FileText size={40} />
         </div>
         <div className="space-y-2">
            <h2 className="text-xl font-black text-foreground tracking-tight">Sem dados da nota</h2>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nenhuma emissão detectada neste ciclo.</p>
         </div>
         <Button onClick={() => navigate('/')} className="px-8 rounded-2xl h-14 uppercase font-black tracking-widest text-[10px]">Voltar ao Início</Button>
       </div>
     );
  }

  const chaveFormatada = notaEmitida.chaveAcesso?.replace(/(.{4})/g, '$1 ').trim();

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'NF Inteligente - NF Emitida',
        text: `Nota Fiscal autorizada para ${notaEmitida.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}. Chave: ${notaEmitida.chaveAcesso}`,
        url: 'https://berith.pro/validar',
        dialogTitle: 'Compartilhar Nota com Cliente',
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const fileName = `NF_${notaEmitida.id}.txt`;
      await Filesystem.writeFile({
        path: fileName,
        data: `DADOS DA NOTA FISCAL\nID: ${notaEmitida.id}\nCHAVE: ${notaEmitida.chaveAcesso}\nVALOR: ${notaEmitida.valorTotal}`,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      alert('Arquivo salvo com sucesso!');
    } catch (error) {
      const blob = new Blob([`NF ${notaEmitida.id}\nValor: ${notaEmitida.valorTotal}`], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nota_${notaEmitida.id}.txt`;
      a.click();
    }
  };

  const finalizar = () => {
    reset();
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 space-y-12 pb-32 overflow-hidden">
       {/* Success Hero */}
       <div className="flex flex-col items-center justify-center pt-12 space-y-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-12 h-64 w-64 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
          
          <div className="relative group">
             <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:blur-3xl transition-all"></div>
             <div className="h-24 w-24 rounded-[2.5rem] bg-foreground text-background flex items-center justify-center relative shadow-2xl shadow-primary/40 active:scale-90 transition-transform">
                <CheckCircle2 size={48} className="animate-in zoom-in-50 duration-500" />
             </div>
             <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg border-4 border-background">
                <ShieldCheck size={14} />
             </div>
          </div>

          <div className="text-center space-y-2">
             <h1 className="text-4xl font-black font-display tracking-tighter text-foreground leading-none animate-in slide-in-from-bottom duration-500 delay-100">Protocolo <br/> <span className="text-primary italic">Autorizado.</span></h1>
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-60 animate-in slide-in-from-bottom duration-500 delay-200">Emissão Concluída com Sucesso</p>
          </div>
       </div>

       {/* Fiscal Data Box */}
       <Card className="p-10 bg-card border-none shadow-2xl shadow-black/10 rounded-[3rem] space-y-10 relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Landmark size={80} className="group-hover:rotate-6 transition-transform duration-700" />
          </div>

          <div className="space-y-3">
             <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] px-1">Chave de Identificação</p>
             <div className="p-6 bg-muted/30 rounded-[1.5rem] border border-border/50 group-hover:border-primary/20 transition-all">
                <p className="font-mono text-xs font-bold text-foreground/80 leading-relaxed tracking-wider break-all text-center">
                   {chaveFormatada}
                </p>
             </div>
          </div>

          <div className="flex items-end justify-between px-2">
             <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Montante Total</p>
                <p className="text-3xl font-black text-foreground font-display tracking-tighter leading-none">{formatCurrency(notaEmitida.valorTotal)}</p>
             </div>
             <div className={`h-12 px-6 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/5 ${notaEmitida.tipo === 'NFSe' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-orange-500/10 text-orange-500'}`}>
                {notaEmitida.tipo}
             </div>
          </div>
       </Card>
       
       {/* Quick Actions Grid */}
       <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <button 
                onClick={handleDownload}
                className="flex flex-col items-center justify-center gap-3 p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-[2rem] hover:bg-card hover:shadow-xl hover:shadow-black/5 transition-all group lg:aspect-square"
             >
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Download size={20} />
                </div>
                <span className="text-[10px] font-black text-foreground/80 uppercase tracking-widest">Salvar PDF</span>
             </button>

             <button 
                onClick={handleShare}
                className="flex flex-col items-center justify-center gap-3 p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-[2rem] hover:bg-card hover:shadow-xl hover:shadow-black/5 transition-all group lg:aspect-square"
             >
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Share2 size={20} />
                </div>
                <span className="text-[10px] font-black text-foreground/80 uppercase tracking-widest">Enviar</span>
             </button>
          </div>

          <Button 
             variant="outline" 
             onClick={() => navigate(`/emissao/resultado/${notaEmitida.id}/pdf`)} 
             className="w-full h-20 rounded-[1.5rem] border-primary/20 bg-background hover:bg-primary/5 flex items-center justify-between px-8 group transition-all"
          >
             <div className="flex items-center gap-4">
                <FileText size={20} className="text-primary" />
                <span className="text-[10px] font-black text-foreground/80 uppercase tracking-[0.2em]">Visualizar Documento Fiscal</span>
             </div>
             <ChevronRight size={18} className="text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
          </Button>
       </div>
       
       {/* Final Conclusion Button */}
       <div className="fixed bottom-8 left-6 right-6 z-50">
          <Button 
             onClick={finalizar} 
             className="w-full h-16 rounded-2xl shadow-2xl shadow-primary/30 flex items-center justify-between px-8 group overflow-hidden"
          >
             <div className="flex items-center gap-3">
                <Home size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="font-black uppercase tracking-[0.2em] text-[10px]">Concluir Operação</span>
             </div>
             <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Button>
       </div>
    </div>
  );
}

