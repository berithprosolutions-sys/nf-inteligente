// FEATURE: emissao/resultado/DANFE
// Responsabilidade: Visualização do DANFE simulado com dados reais do emissaoStore
import { useNavigate } from 'react-router-dom';
import { useEmissaoStore } from '../../store/emissaoStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Button } from '@/shared/components/ui/Button';
import { formatCurrency } from '@/shared/lib/formatters';
import { ArrowLeft, Printer } from 'lucide-react';

export default function PdfPage() {
  const navigate = useNavigate();
  const { notaEmitida } = useEmissaoStore();
  const { empresa } = useAuthStore();

  if (!notaEmitida) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">DANFE não disponível — emita uma nota primeiro.</p>
        <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
      </div>
    );
  }

  const chaveFormatada = notaEmitida.chaveAcesso
    ?.replace(/(.{4})/g, '$1 ')
    .trim() ?? '';

  const dataEmissao = new Date().toLocaleDateString('pt-BR');
  const horaEmissao = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-gray-100 min-h-screen p-3">
      {/* Controles */}
      <div className="flex justify-between items-center mb-4 no-print">
        <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft size={16} /> Fechar
        </Button>
        <Button onClick={() => window.print()} className="flex items-center gap-2">
          <Printer size={16} /> Imprimir
        </Button>
      </div>

      {/* DANFE */}
      <div className="bg-white shadow-lg rounded-sm max-w-2xl mx-auto text-[11px] font-mono border border-gray-400">

        {/* Cabeçalho */}
        <div className="border-b border-gray-400 p-3 flex gap-3">
          {/* Logo/Emitente */}
          <div className="flex-1 border border-gray-300 p-2">
            <div className="font-bold text-[13px] uppercase">{empresa?.razaoSocial ?? 'EMPRESA EMITENTE'}</div>
            <div className="text-gray-600 mt-1">CNPJ: {empresa?.cnpj ?? '00.000.000/0001-00'}</div>
            <div className="text-gray-600">{empresa?.municipio ?? 'Município'} - {empresa?.uf ?? 'UF'}</div>
          </div>

          {/* Título DANFE */}
          <div className="w-40 border border-gray-300 p-2 text-center flex flex-col justify-center">
            <div className="font-black text-[13px] uppercase tracking-tight">DANFE</div>
            <div className="text-[9px] text-gray-500 mt-1">Documento Auxiliar da Nota Fiscal Eletrônica</div>
            <div className="mt-2 border border-gray-300 rounded p-1">
              <div className="text-[9px] text-gray-500">Tipo</div>
              <div className="font-bold">{notaEmitida.tipo === 'NFSe' ? '2 - Saída' : '1 - Entrada'}</div>
            </div>
          </div>

          {/* Número / Série */}
          <div className="w-32 border border-gray-300 p-2 flex flex-col gap-1">
            <div>
              <div className="text-[9px] text-gray-500 uppercase">Nº</div>
              <div className="font-bold">000.000.001</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-500 uppercase">Série</div>
              <div className="font-bold">001</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-500 uppercase">Folha</div>
              <div>1/1</div>
            </div>
          </div>
        </div>

        {/* Chave de Acesso */}
        <div className="border-b border-gray-400 p-2 bg-gray-50">
          <div className="text-[9px] text-gray-500 uppercase mb-1">Chave de Acesso</div>
          <div className="font-bold tracking-wider text-center break-all text-[10px]">{chaveFormatada}</div>
        </div>

        {/* Status SEFAZ */}
        <div className="border-b border-gray-400 p-2 bg-green-50 text-center">
          <span className="text-green-700 font-black uppercase text-[11px] tracking-wide">
            ✓ Autorizado o Uso da NF-e [SIMULADA] — {dataEmissao} {horaEmissao}
          </span>
        </div>

        {/* Destinatário */}
        <div className="border-b border-gray-400 p-2">
          <div className="text-[9px] font-bold text-gray-500 uppercase mb-2 border-b border-dashed border-gray-300 pb-1">
            Destinatário / Remetente
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <div className="text-[9px] text-gray-500">Nome / Razão Social</div>
              <div className="font-bold">Cliente Destinatário</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-500">CNPJ/CPF</div>
              <div className="font-bold">—</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-500">Data Emissão</div>
              <div className="font-bold">{dataEmissao}</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-500">Hora Emissão</div>
              <div className="font-bold">{horaEmissao}</div>
            </div>
            <div>
              <div className="text-[9px] text-gray-500">Tipo</div>
              <div className="font-bold">{notaEmitida.tipo}</div>
            </div>
          </div>
        </div>

        {/* Tabela de Produtos */}
        <div className="border-b border-gray-400 p-2">
          <div className="text-[9px] font-bold text-gray-500 uppercase mb-2 border-b border-dashed border-gray-300 pb-1">
            Dados dos Produtos / Serviços
          </div>
          <table className="w-full text-[9px]">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-1 pr-2">Descrição</th>
                <th className="text-center py-1 px-1">NCM</th>
                <th className="text-center py-1 px-1">CFOP</th>
                <th className="text-right py-1 px-1">Qtd</th>
                <th className="text-right py-1 px-1">V.Unit</th>
                <th className="text-right py-1 pl-1">V.Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-dashed border-gray-200">
                <td className="py-1 pr-2">Serviço / Produto (Simulado)</td>
                <td className="text-center py-1 px-1">84713019</td>
                <td className="text-center py-1 px-1">5102</td>
                <td className="text-right py-1 px-1">1</td>
                <td className="text-right py-1 px-1">{formatCurrency(notaEmitida.valorTotal)}</td>
                <td className="text-right py-1 pl-1">{formatCurrency(notaEmitida.valorTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totais */}
        <div className="border-b border-gray-400 p-2">
          <div className="text-[9px] font-bold text-gray-500 uppercase mb-2 border-b border-dashed border-gray-300 pb-1">
            Cálculo do Imposto
          </div>
          <div className="grid grid-cols-3 gap-1 text-[9px]">
            <div className="border border-gray-300 p-1">
              <div className="text-gray-500">Base Cálc. ICMS</div>
              <div className="font-bold">{formatCurrency(notaEmitida.valorTotal)}</div>
            </div>
            <div className="border border-gray-300 p-1">
              <div className="text-gray-500">Valor ICMS</div>
              <div className="font-bold">{formatCurrency(notaEmitida.valorTotal * 0.18)}</div>
            </div>
            <div className="border border-gray-300 p-1">
              <div className="text-gray-500">Valor IPI</div>
              <div className="font-bold">R$ 0,00</div>
            </div>
            <div className="border border-gray-300 p-1">
              <div className="text-gray-500">Valor Frete</div>
              <div className="font-bold">R$ 0,00</div>
            </div>
            <div className="border border-gray-300 p-1">
              <div className="text-gray-500">Outras Desp.</div>
              <div className="font-bold">R$ 0,00</div>
            </div>
            <div className="border-2 border-gray-700 p-1 bg-gray-50">
              <div className="text-gray-700 font-bold uppercase">Valor Total NF</div>
              <div className="font-black text-[12px]">{formatCurrency(notaEmitida.valorTotal)}</div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-2 text-center text-[9px] text-gray-400">
          DANFE SIMULADO — NF Inteligente v1.0 — Este documento não tem validade jurídica
        </div>
      </div>
    </div>
  );
}
