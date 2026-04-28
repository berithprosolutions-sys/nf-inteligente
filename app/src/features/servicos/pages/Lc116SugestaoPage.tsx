import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Sparkles } from 'lucide-react';

export default function Lc116SugestaoPage() {
  const navigate = useNavigate();
  return (
    <div className="p-4 flex flex-col justify-center min-h-[70vh]">
      <div className="text-center bg-blue-50 border border-blue-200 p-6 rounded-2xl shadow-sm">
        <Sparkles size={40} className="text-blue-500 mx-auto mb-4" />
        <h2 className="font-bold text-xl text-blue-900 mb-2">Classificação de Serviço</h2>
        <div className="bg-white px-4 py-3 rounded text-2xl font-black font-mono border-2 border-blue-100 text-primary mb-4">
          1.01
        </div>
        <p className="text-sm text-blue-800 font-medium">Análise e desenvolvimento de sistemas.</p>
        <p className="text-xs mt-3 text-text-muted bg-white p-2 rounded border">ISS Médio Prefeito SP: 2.0% à 5.0%</p>
      </div>
      <Button onClick={() => navigate('/servicos')} className="h-12 w-full mt-6">Confirmar Seleção</Button>
    </div>
  );
}
