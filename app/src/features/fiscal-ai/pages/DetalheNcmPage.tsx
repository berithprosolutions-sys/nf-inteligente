import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';

export default function DetalheNcmPage() {
  const { codigo } = useParams();
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 bg-white">&larr; Voltar para Busca</Button>
      <h1 className="text-3xl font-black font-mono text-primary-dark">{codigo}</h1>
      <p className="text-sm uppercase font-bold text-text-muted mt-2">Visão Nacional da Regra</p>
      
      <div className="mt-8 bg-surface border rounded-xl p-6 shadow-sm">
          <p className="text-md">Detalhamento legal do NCM da tabela original. Dados do simulador carregados em cache de estado na Fase 2.</p>
      </div>
    </div>
  );
}
