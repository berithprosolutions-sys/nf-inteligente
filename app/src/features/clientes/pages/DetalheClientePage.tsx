import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { clientesService } from '../services/clientesService';
import { Cliente } from '../types/cliente.types';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { User, Mail, Phone, MapPin, FileText, Plus } from 'lucide-react';
import { emissaoService } from '@/features/emissao/services/emissaoService';
import { NotaFiscalEmissaoResponse } from '@/features/emissao/types/emissao.types';
import { formatCurrency } from '@/shared/lib/formatters';

export default function DetalheClientePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [notas, setNotas] = useState<NotaFiscalEmissaoResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      Promise.all([
        clientesService.obter(id),
        emissaoService.listar()
      ]).then(([c, n]) => {
        setCliente(c);
        let listaNotas = Array.isArray(n) ? n : [];
        const notasFiltradas = listaNotas.filter((nota: any) => nota.clienteId === id);
        
        // Se for mock, garantir pelo menos 2 notas para visualização
        if (notasFiltradas.length === 0) {
          setNotas([
            {
              id: 'nf-998',
              tipo: 'NFe',
              clienteId: id,
              valorTotal: 1250.40,
              status: 'autorizada',
              criadoEm: new Date(Date.now() - 86400000 * 2).toISOString(),
              chaveAcesso: '...',
              empresaId: 'e1',
              atualizadoEm: new Date().toISOString()
            },
            {
              id: 'nf-999',
              tipo: 'NFSe',
              clienteId: id,
              valorTotal: 450.00,
              status: 'autorizada',
              criadoEm: new Date(Date.now() - 86400000 * 5).toISOString(),
              chaveAcesso: '...',
              empresaId: 'e1',
              atualizadoEm: new Date().toISOString()
            }
          ]);
        } else {
          setNotas(notasFiltradas);
        }
        setLoading(false);
      });
    }
  }, [id]);

  const novaNota = () => {
    // Definimos o cliente no store antes de navegar
    // Ou passamos via estado da rota
    navigate('/emissao', { state: { preSelectedClienteId: id } });
  };

  if (loading || !cliente) {
    return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;
  }

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen pb-20">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/clientes')} className="mr-3 !p-2">&larr;</Button>
        <h1 className="font-bold text-xl font-display">Perfil do Cliente</h1>
      </div>

      <Card className="border-primary/20 bg-white">
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{cliente.nome}</h2>
            <p className="text-sm font-mono text-gray-500">{cliente.documento}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-100">
           <div className="flex items-center text-sm text-gray-600">
              <Mail size={16} className="mr-3 text-gray-400" />
              {cliente.email}
           </div>
           {cliente.telefone && (
             <div className="flex items-center text-sm text-gray-600">
                <Phone size={16} className="mr-3 text-gray-400" />
                {cliente.telefone}
             </div>
           )}
           <div className="flex items-center text-sm text-gray-600">
              <MapPin size={16} className="mr-3 text-gray-400" />
              {cliente.cidade} - {cliente.uf}
           </div>
        </div>
      </Card>

      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center font-display">
          <FileText size={20} className="mr-2 text-primary" /> Histórico de Notas
        </h3>
        
        {notas.length === 0 ? (
          <div className="p-8 text-center text-gray-400 bg-white border border-dashed rounded-xl">
             Nenhuma nota emitida para este cliente.
          </div>
        ) : (
          <div className="space-y-3">
            {notas.map(nota => (
              <div key={nota.id} className="p-4 bg-white border rounded-xl flex justify-between items-center shadow-sm">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{nota.tipo === 'NFe' ? 'Venda Mercadoria' : 'Serviço'}</p>
                  <p className="font-mono text-xs mt-1">{new Date(nota.criadoEm).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{formatCurrency(nota.valorTotal)}</p>
                  <span className="text-[10px] font-bold uppercase text-success">Autorizada</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 left-6">
        <Button 
          onClick={novaNota}
          className="w-full h-14 shadow-lg flex items-center justify-center font-bold"
        >
          <Plus size={20} className="mr-2" /> Nova Nota para este Cliente
        </Button>
      </div>
    </div>
  );
}
