import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';
import { useEmissaoStore } from '../../store/emissaoStore';
import { produtosService } from '@/features/produtos/services/produtosService';
import { Produto } from '@/features/produtos/types/produto.types';
import { ItemNf } from '../../types/emissao.types';
import { formatCurrency } from '@/shared/lib/formatters';
import { ChevronLeft, Plus, Trash2, Package, Sparkles, ArrowRight } from 'lucide-react';

const schema = z.object({
  produtoId: z.string().min(1, 'Selecione um produto'),
  quantidade: z.number().min(1, 'Quantidade mínima é 1'),
});
type FormValues = z.infer<typeof schema>;

export default function ItensNfePage() {
  const navigate = useNavigate();
  const { itens, adicionarItem, removerItem } = useEmissaoStore();
  const [produtos, setProdutos] = useState<Produto[]>([]);
   const [showImpostos, setShowImpostos] = useState(false);
  
  const { control, handleSubmit, watch, reset } = useForm<FormValues & { icms: number, ipi: number, pis: number, cofins: number }>({
    resolver: zodResolver(schema),
    defaultValues: { quantidade: 1, produtoId: '', icms: 18, ipi: 0, pis: 1.65, cofins: 7.6 }
  });
  
  const produtoIdSelecionado = watch('produtoId');
  const produtoSelecionado = produtos.find(p => p.id === produtoIdSelecionado);

  useEffect(() => {
    produtosService.listar().then(setProdutos);
  }, []);

  const onSubmit = (data: any) => {
    if (!produtoSelecionado) return;
    const novoProduto: ItemNf = {
      id: crypto.randomUUID(),
      produtoId: produtoSelecionado.id,
      descricao: produtoSelecionado.nome,
      ncm: produtoSelecionado.ncm,
      quantidade: data.quantidade,
      valorUnitario: produtoSelecionado.valorUnitario,
      valorTotal: produtoSelecionado.valorUnitario * data.quantidade,
      impostos: {
        icms: data.icms,
        ipi: data.ipi,
        pis: data.pis,
        cofins: data.cofins
      }
    };
    adicionarItem(novoProduto);
    reset({ quantidade: 1, produtoId: '', icms: 18, ipi: 0, pis: 1.65, cofins: 7.6 });
    setShowImpostos(false);
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
          <h1 className="text-3xl font-black font-display tracking-tighter text-foreground leading-tight">Quais os <br/> <span className="text-primary italic">itens da nota?</span></h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Passo 02: Composição do pedido</p>
        </div>
      </div>

      {/* Adicionar Item Form */}
      <Card className="p-8 bg-card border-none shadow-2xl shadow-black/10 rounded-[2.5rem] relative overflow-hidden group">
         <div className="absolute top-0 right-0 -m-8 h-24 w-24 bg-primary/5 rounded-full blur-2xl"></div>
         
         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10 text-left">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Produto do Catálogo</label>
               <Controller name="produtoId" control={control} render={({field, fieldState}) => (
                 <div className="relative">
                   <select 
                    {...field} 
                    className={`w-full appearance-none bg-muted/30 border-2 rounded-2xl py-4 pl-4 pr-10 text-sm font-bold focus:outline-none transition-all ${fieldState.error ? 'border-destructive/40' : 'border-transparent focus:border-primary/20'}`}
                   >
                     <option value="">Buscar produto...</option>
                     {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                   </select>
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/30">
                      <Plus size={16} />
                   </div>
                   {fieldState.error && <span className="text-[9px] font-black text-destructive uppercase tracking-tighter mt-1 px-1 block">{fieldState.error.message}</span>}
                 </div>
               )} />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <Controller name="quantidade" control={control} render={({field, fieldState}) => (
                  <Input 
                    label="Quantidade" 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || '')} 
                    error={fieldState.error?.message}
                    className="rounded-2xl h-14"
                  />
               )} />
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Total Item</label>
                  <div className="h-14 w-full bg-muted/30 rounded-2xl flex items-center px-4 text-sm font-black text-foreground/80">
                     {produtoSelecionado ? formatCurrency(produtoSelecionado.valorUnitario * (watch('quantidade') || 1)) : 'R$ 0,00'}
                  </div>
               </div>
            </div>

            {/* Configurações Avançadas de Impostos */}
            <div className="pt-2">
               <button 
                type="button"
                onClick={() => setShowImpostos(!showImpostos)}
                className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10 transition-colors"
               >
                 <Sparkles size={12} />
                 {showImpostos ? 'Ocultar Config. Fiscais' : 'Editar Alíquotas Manuais'}
               </button>

               {showImpostos && (
                 <div className="grid grid-cols-2 gap-3 mt-6 p-6 bg-muted/20 rounded-[1.5rem] border border-border/50 animate-in fade-in zoom-in duration-300">
                    <Controller name="icms" control={control} render={({field}) => (
                      <Input label="ICMS (%)" type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="h-12 bg-card rounded-xl text-xs" />
                    )} />
                    <Controller name="ipi" control={control} render={({field}) => (
                      <Input label="IPI (%)" type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="h-12 bg-card rounded-xl text-xs" />
                    )} />
                    <Controller name="pis" control={control} render={({field}) => (
                      <Input label="PIS (%)" type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="h-12 bg-card rounded-xl text-xs" />
                    )} />
                    <Controller name="cofins" control={control} render={({field}) => (
                      <Input label="COFINS (%)" type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} className="h-12 bg-card rounded-xl text-xs" />
                    )} />
                 </div>
               )}
            </div>
            
            <Button 
                type="submit" 
                variant="outline" 
                disabled={!produtoIdSelecionado}
                className="w-full py-7 border-primary/20 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all font-black uppercase text-[10px] tracking-[0.2em]"
            >
               Acrescentar à Nota
            </Button>
         </form>
      </Card>

      {/* Itens List */}
      <div className="space-y-4">
         <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Cesta da Nota ({itens.length})</h2>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
               Total: {formatCurrency(itens.reduce((acc, item) => acc + item.valorTotal, 0))}
            </span>
         </div>

         {itens.length === 0 ? (
           <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 opacity-30">
              <Package size={48} className="text-muted-foreground" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Sua nota fiscal está <br/> aguardando o primeiro item.</p>
           </div>
         ) : (
           <div className="space-y-3">
             {itens.map(item => (
               <div key={item.id} className="group p-5 bg-card/40 backdrop-blur-sm border border-border/50 rounded-[1.5rem] flex justify-between items-center transition-all animate-in slide-in-from-bottom-2 duration-300">
                 <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground/50">
                       <Package size={20} />
                    </div>
                    <div>
                      <p className="font-black text-xs text-foreground uppercase tracking-tight">{item.descricao}</p>
                      <p className="text-[9px] font-bold text-muted-foreground/60 mt-0.5">
                        {item.quantidade} UN • {formatCurrency(item.valorUnitario)}
                      </p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                   <p className="font-black text-sm text-foreground">{formatCurrency(item.valorTotal)}</p>
                   <button 
                    onClick={() => removerItem(item.id)} 
                    className="h-8 w-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-all shadow-sm active:scale-90"
                   >
                     <Trash2 size={14} />
                   </button>
                 </div>
               </div>
             ))}
           </div>
         )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-6 right-6 z-50">
         <Button 
            onClick={() => navigate('/emissao/nfe/revisao')} 
            disabled={itens.length === 0} 
            className="w-full h-16 rounded-2xl shadow-2xl shadow-primary/20 flex items-center justify-between px-8 group overflow-hidden"
         >
            <div className="flex items-center gap-3">
               <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
               <span className="font-black uppercase tracking-[0.2em] text-[10px]">Fiscalização Inteligente</span>
            </div>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
         </Button>
      </div>
    </div>
  );
}
