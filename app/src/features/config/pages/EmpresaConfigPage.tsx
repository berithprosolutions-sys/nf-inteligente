import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { empresaService } from '../services/empresaService';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Building2, Hash, CheckCircle2, AlertTriangle, Fingerprint } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function EmpresaConfigPage() {
  const navigate = useNavigate();
  const { empresa, setEmpresa } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Form states
  const [razaoSocial, setRazaoSocial] = useState(empresa?.razaoSocial || '');
  const [nomeFantasia, setNomeFantasia] = useState(empresa?.nomeFantasia || '');
  const [cnpj] = useState(empresa?.cnpj || '');
  const [cnae, setCnae] = useState(empresa?.cnae || '');
  const [inscricaoEstadual, setInscricaoEstadual] = useState(empresa?.inscricaoEstadual || '');
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState(empresa?.inscricaoMunicipal || '');

  const handleSave = async () => {
    if (!empresa?.id) return;
    setLoading(true);
    setErro(null);
    setSucesso(false);

    try {
      const updated = await empresaService.atualizar(empresa.id, {
        razaoSocial,
        nomeFantasia,
        cnpj: cnpj.replace(/\D/g, ''),
        cnae,
        inscricaoEstadual,
        inscricaoMunicipal
      });
      setEmpresa(updated);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch (err: any) {
      setErro(err?.response?.data?.message ?? 'Erro ao atualizar dados da empresa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6 bg-background min-h-screen pb-20">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="rounded-full h-10 w-10 p-0">
          &larr;
        </Button>
        <div>
           <h1 className="text-2xl font-black text-primary font-display">Dados Jurídicos</h1>
           <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Configurações de Emissão</p>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-primary/5 pb-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Identificação da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <Input 
              label="Razão Social" 
              value={razaoSocial} 
              onChange={(e) => setRazaoSocial(e.target.value)} 
            />
            <Input 
              label="Nome Fantasia" 
              value={nomeFantasia} 
              onChange={(e) => setNomeFantasia(e.target.value)} 
            />
            <Input 
              label="CNPJ" 
              value={cnpj} 
              disabled
              className="bg-muted/50"
            />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-accent/5 pb-4">
            <CardTitle className="text-sm flex items-center gap-2 text-accent-dark">
              <Fingerprint className="h-4 w-4" />
              Dados Fiscais e CNAE
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
               <div className="relative">
                  <Hash className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input 
                    label="CNAE Principal" 
                    placeholder="Ex: 6201-5/01" 
                    value={cnae} 
                    onChange={(e) => setCnae(e.target.value)}
                    className="pl-9"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                    <AlertTriangle size={10} /> Necessário para Notas de Serviço (NF-Se)
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <Input 
                 label="Inscr. Estadual" 
                 value={inscricaoEstadual} 
                 onChange={(e) => setInscricaoEstadual(e.target.value)} 
               />
               <Input 
                 label="Inscr. Municipal" 
                 value={inscricaoMunicipal} 
                 onChange={(e) => setInscricaoMunicipal(e.target.value)} 
               />
            </div>
          </CardContent>
        </Card>
      </div>

      {erro && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-3">
          <AlertTriangle size={18} />
          {erro}
        </div>
      )}

      {sucesso && (
        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-600 text-xs font-bold flex items-center gap-3 animate-in fade-in zoom-in">
          <CheckCircle2 size={18} />
          Dados atualizados com sucesso!
        </div>
      )}

      <Button 
        className="w-full h-14 rounded-2xl text-lg font-black shadow-lg shadow-primary/20" 
        onClick={handleSave}
        isLoading={loading}
      >
        {!loading && <CheckCircle2 size={20} className="mr-2" />}
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </div>
  );
}
