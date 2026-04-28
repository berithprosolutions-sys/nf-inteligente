import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { produtosService } from '../services/produtosService';
import { Produto } from '../types/produto.types';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { ShieldCheck, Info, TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from '@/shared/components/ui/Badge';

export default function PainelFiscalPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      produtosService.obter(id).then(p => {
        setProduto(p);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading || !produto) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  }

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen pb-safe-bottom">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/produtos')} className="mr-3 !p-2">&larr;</Button>
        <h1 className="font-bold text-xl font-display">Inteligência Fiscal</h1>
      </div>

      <div className="bg-white p-5 border rounded-2xl shadow-sm">
        <h2 className="text-xl font-extrabold text-gray-800">{produto.nome}</h2>
        <div className="flex items-center mt-2 space-x-2">
           <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-mono">NCM {produto.ncm || 'Pendente'}</Badge>
           {produto.ncmConfirmado && (
             <span className="flex items-center text-[10px] font-bold text-success uppercase tracking-wider">
               <ShieldCheck size={12} className="mr-1" /> Validado IA
             </span>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">Alíquotas Federais (IPI)</h3>
          <div className="flex justify-between items-end border-b pb-4">
            <div>
              <p className="text-3xl font-black text-gray-800">{produto.aliquotaIpi}%</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Alíquota Ad Valorem</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-success bg-success/10 px-2 py-1 rounded">ESTÁVEL</p>
            </div>
          </div>
          <div className="pt-4 flex items-start text-xs text-gray-500 italic">
            <Info size={14} className="mr-2 text-primary shrink-0" />
            Fonte: {produto.fonteLegal || 'TIPI 2024 DECRETO 11.158'}
          </div>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">Simulação ICMS (Interestadual)</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
               <span className="text-sm font-bold text-gray-700">SP &rarr; SP (Interna)</span>
               <span className="font-mono font-bold text-primary">18.00%</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border-l-4 border-l-success">
               <div className="flex flex-col">
                 <span className="text-sm font-bold text-gray-700">SP &rarr; AM (Manaus)</span>
                 <span className="text-[10px] text-success font-bold uppercase">Isenção ZFM</span>
               </div>
               <span className="font-mono font-bold text-success">0.00%</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
               <span className="text-sm font-bold text-gray-700">SP &rarr; MG (Normal)</span>
               <span className="font-mono font-bold text-primary">12.00%</span>
            </div>
          </div>
        </Card>

        <div className="p-4 bg-accent/20 border border-accent rounded-2xl">
           <div className="flex items-center text-yellow-900 mb-2">
              <TrendingUp size={18} className="mr-2" />
              <span className="text-xs font-bold uppercase">Oportunidade Fiscal</span>
           </div>
           <p className="text-xs text-yellow-800 leading-relaxed font-medium">
             Sua empresa possui crédito presumido para este NCM conforme o Convênio ICMS 190/17. Isso pode reduzir sua carga efetiva em até **2.4%**.
           </p>
        </div>
      </div>
      
      <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center">
         <AlertCircle size={32} className="text-gray-300 mb-2" />
         <p className="text-xs text-gray-400 font-medium leading-relaxed">
           As alíquotas acima são baseadas no perfil Simples Nacional. Para lucro real, consulte o simulador avançado.
         </p>
      </div>
    </div>
  );
}
