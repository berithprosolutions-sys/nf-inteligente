import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicosService } from '../services/servicosService';
import { useServicosStore } from '../store/servicosStore';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { Plus, Briefcase, Search, FileText } from 'lucide-react';

export default function ServicosPage() {
  const navigate = useNavigate();
  const { servicos, setServicos } = useServicosStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    servicosService.listar().then(res => setServicos(res)).finally(() => setLoading(false));
  }, [setServicos]);

  return (
    <div className="p-6 space-y-6 pb-28">
      {/* Header Premium */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
             <h1 className="text-3xl font-black font-display text-foreground tracking-tighter">Serviços</h1>
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">Estratégia e Operações</p>
          </div>
          <Button 
            size="sm" 
            onClick={() => navigate('/servicos/novo')}
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
            placeholder="Pesquisar serviços ou LC116..." 
            className="w-full bg-card/50 border-2 border-border/40 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/30 transition-all placeholder:text-muted-foreground/30"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      ) : (
        <div className="space-y-4">
          {(servicos || []).length === 0 ? (
            <div className="text-center py-20 bg-card rounded-[2.5rem] border-2 border-dashed border-border/40">
               <Briefcase className="mx-auto text-muted-foreground/20 mb-4" size={48} />
               <p className="text-sm font-bold text-muted-foreground">Nenhum serviço registrado</p>
            </div>
          ) : (
            (servicos || []).map(s => (
              <Card 
                key={s.id} 
                className="p-5 cursor-pointer hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98] transition-all group border-none bg-card shadow-lg shadow-black/5"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                      <FileText size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-foreground truncate uppercase tracking-tighter text-sm leading-tight">{s.nome}</p>
                      <p className="text-[9px] font-black text-muted-foreground mt-0.5 tracking-widest">LC116: {s.codigoLC116}</p>
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 text-primary font-black px-2.5 py-1 rounded-xl text-[9px] tracking-widest">
                    {s.aliquotaISSQN}% ISS
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
