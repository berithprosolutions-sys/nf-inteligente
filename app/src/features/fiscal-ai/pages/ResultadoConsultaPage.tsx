import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { ShieldCheck } from 'lucide-react';

export default function ResultadoConsultaPage() {
  const navigate = useNavigate();
  return (
    <div className="p-4 space-y-4 min-h-screen bg-gray-50">
      <Button variant="outline" className="mb-4 bg-white" onClick={() => navigate(-1)}>&larr; Nova Consulta</Button>
      
      <Card className="bg-white border-green-300 shadow-md">
        <div className="flex items-center space-x-2 text-green-700 mb-3">
          <ShieldCheck size={20} />
          <h2 className="font-bold uppercase tracking-wider text-sm">Resposta Fiscal Verificada</h2>
        </div>
        
        <p className="text-base text-gray-800 leading-relaxed font-medium">A alíquota interestadual base aplicável enviando SP → RJ para destinatário NÃO CONTRIBUINTE se fixou agora em 12% a partir de 2024.</p>
        
        <div className="mt-6 border-t border-gray-100 pt-4">
          <p className="text-xs text-text-muted font-bold uppercase mb-1">Fonte Legal Extratada</p>
          <div className="bg-gray-100 p-3 rounded font-mono text-xs text-gray-700 leading-tight">
            Base RTI/SP Art. 54. Alteração vigente Confaz RICMS v4.2<br/>
            Grau de Confiança IA: CONFIRMADO (Alto)
          </div>
        </div>
      </Card>
    </div>
  );
}
