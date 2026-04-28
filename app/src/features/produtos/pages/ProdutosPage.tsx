import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { produtosService } from '../services/produtosService';
import { useProdutosStore } from '../store/produtosStore';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { formatCurrency } from '@/shared/lib/formatters';
import { Plus, Package, ChevronRight, Search, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function ProdutosPage() {
  const navigate = useNavigate();
  const { produtos, setProdutos } = useProdutosStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    produtosService.listar().then(res => setProdutos(res)).finally(() => setLoading(false));
  }, [setProdutos]);

  return (
    <div className="p-6 space-y-6 pb-28">
      {/* Header Premium */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
             <h1 className="text-3xl font-black font-display text-foreground tracking-tighter">Catálogo</h1>
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Gestão de produtos e NCM</p>
          </div>
          <Button 
            size="sm" 
            onClick={() => navigate('/produtos/novo')}
            className="rounded-full h-12 w-12 !p-0 shadow-lg"
          >
            <Plus size={24} />
          </Button>
        </div>

        {/* Busca Simplificada */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou NCM..." 
            className="w-full bg-card/50 border-2 border-border/40 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/30 transition-all placeholder:text-muted-foreground/30"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      ) : (
        <div className="space-y-4">
          {(produtos || []).length === 0 ? (
            <div className="text-center py-20 bg-card rounded-[2.5rem] border-2 border-dashed border-border/40">
               <Package className="mx-auto text-muted-foreground/20 mb-4" size={48} />
               <p className="text-sm font-bold text-muted-foreground">Nenhum produto em estoque</p>
            </div>
          ) : (
            (produtos || []).map(p => (
              <Card 
                key={p.id} 
                className="p-5 cursor-pointer hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98] transition-all group border-none bg-card shadow-lg shadow-black/5" 
                onClick={() => navigate(`/produtos/${p.id}/fiscal`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${p.ncm ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive shadow-inner'}`}>
                      {p.ncm ? <ShieldCheck size={22} /> : <ShieldAlert size={22} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-foreground truncate uppercase tracking-tighter text-sm leading-tight">{p.nome}</p>
                      <p className="text-[10px] font-black text-primary mt-0.5 tracking-widest">{formatCurrency(p.valorUnitario)}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-muted-foreground/20 group-hover:text-primary transition-colors mt-2" size={18} />
                </div>
                
                {p.ncm && (
                  <div className="mt-3 pt-3 border-t border-border/20 flex items-center justify-between">
                     <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">NCM Identificado</span>
                     <span className="text-[9px] font-mono font-bold bg-muted px-2 py-0.5 rounded-lg text-foreground">{p.ncm}</span>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
