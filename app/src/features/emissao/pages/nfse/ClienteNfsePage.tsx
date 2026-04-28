import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { useClientesStore } from '@/features/clientes/store/clientesStore';
import { useEmissaoStore } from '../../store/emissaoStore';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { Search, MapPin, UserPlus, ChevronLeft, ArrowRight } from 'lucide-react';

export default function ClienteNfsePage() {
  const navigate = useNavigate();
  const { clientes, isLoading, fetchClientes } = useClientesStore();
  const { setClienteId, clienteId } = useEmissaoStore();
  const [busca, setBusca] = useState('');

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const clientesFiltrados = useMemo(() => {
    return clientes.filter(c => 
      c.nome.toLowerCase().includes(busca.toLowerCase()) || 
      c.documento.includes(busca)
    );
  }, [clientes, busca]);

  const selecionarCliente = (id: string) => {
    setClienteId(id);
    navigate('/emissao/nfse/servico');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6 space-y-6 pb-32">
      {/* Step Indicator & Header */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="h-12 w-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-foreground active:scale-90 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-1">
             <div className="h-1.5 w-8 rounded-full bg-primary"></div>
             <div className="h-1.5 w-4 rounded-full bg-muted/40"></div>
             <div className="h-1.5 w-4 rounded-full bg-muted/40"></div>
          </div>
          <button 
            onClick={() => navigate('/clientes/novo')}
            className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center active:scale-90 transition-all"
          >
            <UserPlus size={20} />
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-black font-display tracking-tighter text-foreground leading-tight">Quem é o <br/> <span className="text-primary italic">Tomador?</span></h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Passo 01: Identificação do cliente</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Pesquisar por nome ou documento..." 
          className="w-full bg-card/50 border-2 border-border/40 rounded-[1.5rem] py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/30 transition-all placeholder:text-muted-foreground/30"
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      ) : (
        <div className="space-y-4">
          {clientesFiltrados.map((cliente) => (
            <div 
              key={cliente.id}
              onClick={() => selecionarCliente(cliente.id)}
              className={`p-5 bg-card rounded-[2rem] border-2 transition-all active:scale-[0.98] group relative overflow-hidden ${clienteId === cliente.id ? 'border-primary shadow-xl shadow-primary/10' : 'border-transparent shadow-lg shadow-black/5'}`}
            >
              {clienteId === cliente.id && (
                <div className="absolute top-0 right-0 p-4">
                   <div className="bg-primary text-white p-1 rounded-full"><ArrowRight size={12}/></div>
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm ${cliente.tipo === 'PJ' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {cliente.nome.charAt(0)}
                </div>
                <div className="min-w-0 pr-4">
                  <h3 className="font-black text-foreground truncate uppercase tracking-tighter">{cliente.nome}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{cliente.documento}</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${cliente.tipo === 'PJ' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {cliente.tipo}
                    </span>
                  </div>
                  <div className="flex items-center mt-3 text-[9px] text-muted-foreground/70 font-black uppercase tracking-widest">
                    <MapPin size={10} className="mr-1 opacity-50" />
                    {cliente.cidade} • {cliente.uf}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {clientesFiltrados.length === 0 && (
            <div className="text-center py-24 bg-card rounded-[2.5rem] border-2 border-dashed border-border/40">
               <div className="h-16 w-16 bg-muted/30 rounded-3xl mx-auto flex items-center justify-center text-muted-foreground/20 mb-4">
                  <Search size={32} />
               </div>
               <p className="text-sm font-bold text-muted-foreground px-12 leading-relaxed">Nenhum cliente disponível no momento.</p>
               <Button onClick={() => navigate('/clientes/novo')} variant="link" className="text-primary font-black uppercase tracking-widest text-[10px] mt-4">Registrar Novo</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

