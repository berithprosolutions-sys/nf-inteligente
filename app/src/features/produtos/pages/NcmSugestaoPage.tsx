import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Sparkles, ShieldCheck } from 'lucide-react';

const mockOpcoes = [
  { codigo: '8471.30.19', descricao: 'Máquinas automáticas para processamento de dados digitais, portáteis (ex. Notebooks)', ipi: 0, recomendada: true, legislacao: 'TIPI 2024 DECRETO 11.158' },
  { codigo: '8471.30.12', descricao: 'Outras máquinas...', ipi: 5, recomendada: false, legislacao: 'TIPI 2024' },
  { codigo: '8471.30.90', descricao: 'Outras', ipi: 15, recomendada: false, legislacao: 'TIPI 2024' },
];

export default function NcmSugestaoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const selecionarNcm = (codigo: string) => {
    // Simulando submit para backend e store de produtos
    console.log(`NCM ${codigo} associado ao produto ${id}`);
    navigate(`/produtos`);
  };

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center space-x-3 mb-2">
         <Button variant="outline" onClick={() => navigate(-1)}>&larr;</Button>
         <h1 className="font-bold text-xl font-display">Busca IA: NCM {id ? `(ID: ${id})` : ''}</h1>
      </div>
      
      <div className="p-4 bg-[#FEF3C7] border border-accent rounded-xl shadow-sm">
        <div className="flex items-center space-x-2 text-yellow-900 mb-2">
            <Sparkles size={20} className="text-accent" />
            <p className="font-bold">Análise Inteligente</p>
        </div>
        <p className="text-sm text-yellow-800">Com base na descrição do seu produto as compatibilidades mais assertivas da tabela TIPI são:</p>
      </div>

      <div className="space-y-4">
        {mockOpcoes.map((opcao) => (
          <Card key={opcao.codigo} className={`border-2 ${opcao.recomendada ? 'border-success bg-success/5 relative overflow-hidden' : 'border-gray-200'}`}>
            {opcao.recomendada && (
               <div className="absolute top-0 right-0 bg-success text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center">
                 <ShieldCheck size={12} className="mr-1" /> Inteligência Recomenda
               </div>
            )}
            <p className="text-2xl font-black font-mono text-primary-dark tracking-widest">{opcao.codigo}</p>
            <p className="text-sm text-gray-700 mt-2 min-h-[40px] leading-tight font-medium">{opcao.descricao}</p>
            <div className="flex flex-col mt-4 space-y-1 text-xs">
               <div className="flex items-center">
                 <Badge variant="info">IPI: {opcao.ipi}%</Badge>
               </div>
               <span className="text-text-muted font-mono bg-gray-100 p-1 rounded inline-block mt-1">Fonte Legal: {opcao.legislacao}</span>
            </div>
            <Button onClick={() => selecionarNcm(opcao.codigo)} variant={opcao.recomendada ? 'primary' : 'outline'} className="w-full mt-5 h-12 text-sm font-bold">
               Classificar com este NCM
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
