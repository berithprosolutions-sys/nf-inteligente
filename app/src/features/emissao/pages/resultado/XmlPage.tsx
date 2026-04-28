import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
export default function XmlPage() {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <Button variant="outline" className="mb-4" onClick={() => navigate(-1)}>&larr; Fechar</Button>
      <div className="bg-[#1e1e1e] border-l-4 border-yellow-500 rounded p-4 font-mono text-xs overflow-auto h-[60vh]">
        <pre className="text-gray-300">
{`<?xml version="1.0" encoding="UTF-8"?>
<nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe Id="NFe352..." versao="4.00">
      <ide>
        <cUF>35</cUF>
        <cNF>00000123</cNF>
        <natOp>Venda</natOp>
        <tpAmb>2</tpAmb>
      </ide>
      <!-- Extrutura Restante Fictícia -->
    </infNFe>
  </NFe>
  <protNFe versao="4.00">
    <infProt>
      <tpAmb>2</tpAmb>
      <verAplic>SP_NFE_PL_009_V4</verAplic>
      <chNFe>...</chNFe>
      <dhRecbto>2026-04-22T00:00:00-03:00</dhRecbto>
      <nProt>135...</nProt>
      <cStat>100</cStat>
      <xMotivo>Autorizado o uso da NF-e</xMotivo>
    </infProt>
  </protNFe>
</nfeProc>`}
        </pre>
      </div>
    </div>
  );
}
