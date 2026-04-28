import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';

export default function TabelaNcmPage() {
  const navigate = useNavigate();
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
         <Button variant="outline" onClick={() => navigate(-1)}>&larr;</Button>
         <h1 className="text-xl font-bold">Nomenclatura (NCM)</h1>
      </div>
      <Input label="Buscar código ou descrição" placeholder="Ex: 8471" />
      <div className="mt-4 border border-gray-200 rounded divide-y bg-white">
        <div className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => navigate('/fiscal/ncm/8471.30.19')}>
            <p className="font-mono text-lg font-bold text-primary">8471.30.19</p>
            <p className="text-sm text-text-muted">Máquinas portáteis...</p>
        </div>
      </div>
    </div>
  );
}
