import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';
import { servicosService } from '../services/servicosService';
import { ChevronLeft, Sparkles, ShieldAlert, FileText, BadgeDollarSign, Target } from 'lucide-react';

export default function NovoServicoPage() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [codigoLC116, setCodigoLC116] = useState('');
  const [aliquotaISSQN, setAliquotaISSQN] = useState('');
  const [valorPadrao, setValorPadrao] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    const valor = parseFloat(valorPadrao.replace(',', '.'));
    const aliquota = parseFloat(aliquotaISSQN.replace(',', '.'));

    if (isNaN(valor) || valor <= 0) {
      setErro('Valor unitário inválido.');
      return;
    }

    setLoading(true);
    try {
      await servicosService.criar({
        nome,
        descricao: descricao || undefined,
        codigoLC116: codigoLC116 || undefined,
        lc116Confirmado: !!codigoLC116,
        aliquotaISSQN: isNaN(aliquota) ? undefined : aliquota,
        valorPadrao: valor,
        unidade: 'UN'
      });
      navigate('/servicos');
    } catch (err: any) {
      setErro(err?.response?.data?.message ?? err?.message ?? 'Erro ao salvar serviço.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-lg mx-auto pb-24">
       {/* Header com Navegação */}
       <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="h-12 w-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-foreground active:scale-90 transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black font-display tracking-tighter">Novo Serviço</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Defina sua oferta de valor</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card className="p-2 border-none shadow-2xl shadow-black/5 bg-card/80 backdrop-blur-md">
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <Input
                label="Nome do Serviço"
                placeholder="Ex: Consultoria Legislativa"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <Input
                label="Descrição dos Trabalhos"
                placeholder="Detalhes para o contrato..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />

              <Input
                label="Custo Base de Execução (R$)"
                placeholder="0,00"
                value={valorPadrao}
                onChange={(e) => setValorPadrao(e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        <div className="space-y-4 pt-2">
          <div className="flex items-center px-2">
             <Target size={12} className="text-primary mr-2" />
             <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Enquadramento Tributário</h2>
          </div>
          
          <Card className="p-6 border-none shadow-xl shadow-black/5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Código LC 116"
                placeholder="Ex: 1.05"
                value={codigoLC116}
                onChange={(e) => setCodigoLC116(e.target.value)}
              />
              <Input
                label="Aliq. ISS (%)"
                placeholder="2.00"
                value={aliquotaISSQN}
                onChange={(e) => setAliquotaISSQN(e.target.value)}
              />
            </div>
          </Card>
        </div>

        {/* Banner Assistente IA */}
        <div 
          onClick={() => navigate('/fiscal')}
          className="cursor-pointer relative group overflow-hidden rounded-[2rem] p-6 bg-primary shadow-2xl shadow-primary/20 active:scale-95 transition-all"
        >
          <div className="absolute top-0 right-0 -m-4 opacity-10 rotate-12">
             <Sparkles size={120} className="text-white fill-white" />
          </div>
          <div className="relative z-10 flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                <FileText size={24} />
             </div>
             <div>
                <h3 className="text-white font-black text-sm uppercase tracking-tighter">Berith Intelligence</h3>
                <p className="text-white/70 text-[10px] font-medium leading-tight mt-0.5">Identificar CNAE e LC-116 automaticamente</p>
             </div>
          </div>
        </div>

        {erro && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest animate-in shake duration-300">
            <ShieldAlert size={16} />
            {erro}
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-7 group"
          isLoading={loading}
        >
          <div className="flex items-center gap-2">
             {!loading && <BadgeDollarSign size={18} className="group-hover:scale-110 transition-transform" />}
             {loading ? 'Sincronizando...' : 'Concluir Registro'}
          </div>
        </Button>
      </form>
    </div>
  );
}
