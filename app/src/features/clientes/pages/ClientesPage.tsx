import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientesService } from '../services/clientesService';
import { useClientesStore } from '../store/clientesStore';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { Plus, User, ChevronRight, Search } from 'lucide-react';

export default function ClientesPage() {
  const navigate = useNavigate();
  const { clientes, setClientes } = useClientesStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    clientesService.listar().then(res => {
      setClientes(res);
    }).finally(() => setLoading(false));
  }, [setClientes]);

  return (
    <div className="p-6 space-y-6 pb-28">
      {/* Header Premium */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
             <h1 className="text-3xl font-black font-display text-foreground tracking-tighter">Clientes</h1>
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Gerencie sua rede comercial</p>
          </div>
          <Button 
            size="sm" 
            onClick={() => navigate('/clientes/novo')}
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
            placeholder="Pesquisar por nome ou CNPJ..." 
            className="w-full bg-card/50 border-2 border-border/40 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/30 transition-all placeholder:text-muted-foreground/30"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      ) : (
        <div className="space-y-4">
          {(clientes || []).length === 0 ? (
            <div className="text-center py-20 bg-card rounded-[2.5rem] border-2 border-dashed border-border/40">
               <User className="mx-auto text-muted-foreground/20 mb-4" size={48} />
               <p className="text-sm font-bold text-muted-foreground">Nenhum cliente cadastrado</p>
            </div>
          ) : (
            (clientes || []).map(c => (
              <Card 
                key={c.id} 
                className="flex items-center p-5 cursor-pointer hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98] transition-all group border-none bg-card shadow-lg shadow-black/5" 
                onClick={() => navigate(`/clientes/${c.id}`)}
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg mr-4">
                  {c.nome.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-foreground truncate uppercase tracking-tighter text-sm">{c.nome}</p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5 tracking-wider">{c.documento}</p>
                </div>
                <ChevronRight className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
