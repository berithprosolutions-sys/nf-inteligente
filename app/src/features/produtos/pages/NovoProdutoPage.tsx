import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';
import { produtosService } from '../services/produtosService';
import { ChevronLeft, Sparkles, ShieldCheck, ShieldAlert, BadgeDollarSign } from 'lucide-react';

const UNIDADES = ['UN', 'KG', 'L', 'M', 'M2', 'M3', 'CX', 'PC', 'PAR', 'DZ'];

export default function NovoProdutoPage() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ncm, setNcm] = useState('');
  const [unidade, setUnidade] = useState('UN');
  const [valorUnitario, setValorUnitario] = useState('');
  const [aliquotaIpi, setAliquotaIpi] = useState('');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    const valor = parseFloat(valorUnitario.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      setErro('Valor unitário inválido.');
      return;
    }

    if (ncm && !/^\d{8}$/.test(ncm)) {
      setErro('NCM deve ter 8 dígitos.');
      return;
    }

    setLoading(true);
    try {
      await produtosService.criar({
        nome,
        descricao: descricao || undefined,
        ncm: ncm || undefined,
        ncmConfirmado: ncm.length === 8,
        unidade,
        valorUnitario: valor,
        aliquotaIpi: aliquotaIpi ? parseFloat(aliquotaIpi) : undefined,
      });
      navigate('/produtos');
    } catch (err: any) {
      setErro(err?.response?.data?.message ?? err?.message ?? 'Erro ao salvar produto.');
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
          <h1 className="text-2xl font-black font-display tracking-tighter">Novo Produto</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Gestão de catálogo inteligente</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card className="p-2 border-none shadow-2xl shadow-black/5 bg-card/80 backdrop-blur-md">
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <Input
                label="Identificação do Produto"
                placeholder="Ex: Cadeira Gamer Branca"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <Input
                label="Observações Adicionais"
                placeholder="Detalhes para a nota..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Valor de Venda (R$)"
                  placeholder="0,00"
                  value={valorUnitario}
                  onChange={(e) => setValorUnitario(e.target.value)}
                  required
                />
                <div className="flex flex-col gap-1.5">
                   <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">Unid. Medida</label>
                   <select
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    className="px-4 py-3.5 border-2 rounded-2xl transition-all border-border focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 bg-muted/30 text-foreground font-medium appearance-none"
                   >
                    {UNIDADES.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                   </select>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4 pt-2">
          <div className="flex items-center px-2">
             <ShieldCheck size={12} className="text-primary mr-2" />
             <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Dados Fiscais (NCM)</h2>
          </div>
          
          <Card className="p-6 border-none shadow-xl shadow-black/5">
            <div className="space-y-4">
              <Input
                label="Código NCM (Mão de Obra ou Produto)"
                placeholder="00000000"
                value={ncm}
                onChange={(e) => setNcm(e.target.value.replace(/\D/g, '').substring(0, 8))}
                maxLength={8}
              />
              
              <Input
                label="Alíquota IPI Especial (%)"
                placeholder="0.00"
                value={aliquotaIpi}
                onChange={(e) => setAliquotaIpi(e.target.value.replace(/[^0-9.,]/g, ''))}
              />
            </div>
          </Card>
        </div>

        {/* Sugestão IA */}
        {nome.length >= 3 && !ncm && (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur opacity-10"></div>
            <div className="relative p-5 rounded-3xl bg-amber-50/50 border border-amber-200/50 flex items-start gap-4">
               <div className="h-10 w-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Sparkles size={20} className="animate-pulse" />
               </div>
               <div className="flex-1">
                  <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Sugestão do Berith</p>
                  <p className="text-xs text-amber-900/70 mt-1 leading-relaxed font-medium">
                    Não sabe o NCM? Salve o produto e use o nosso <strong>Consultor Fiscal IA</strong> posteriormente para identificação automática.
                  </p>
               </div>
            </div>
          </div>
        )}

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
             {loading ? 'Processando...' : 'Confirmar e Salvar'}
          </div>
        </Button>
      </form>
    </div>
  );
}
