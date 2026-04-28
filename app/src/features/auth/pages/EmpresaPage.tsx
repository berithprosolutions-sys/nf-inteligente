import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';
import { authService } from '../services/authService';
import { ChevronRight, ChevronLeft, ShieldAlert, Building2 } from 'lucide-react';

import { ESTADOS_BRASILEIROS } from '@/shared/constants/estados';

export default function EmpresaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dadosPessoais = location.state || {};

  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [cep, setCep] = useState('');
  const [uf, setUf] = useState('SP');
  const [municipio, setMunicipio] = useState('');
  const [codigoMunicipio, setCodigoMunicipio] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const buscarCep = async (valor: string) => {
    const cepLimpo = valor.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setMunicipio(data.localidade);
        setUf(data.uf);
        setCodigoMunicipio(data.ibge); 
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  };

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dadosPessoais.email) {
      setErro('Dados pessoais faltando. Por favor, volte ao passo anterior.');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      await authService.register({
        nome: dadosPessoais.nome,
        email: dadosPessoais.email,
        password: dadosPessoais.password,
        empresa: {
          razaoSocial,
          cnpj: cnpj.replace(/\D/g, ''),
          regimeTributario: 'SimplesNacional',
          uf,
          municipio,
          codigoMunicipio
        }
      });
      
      navigate('/auth/login', { 
        state: { message: 'Conta criada com sucesso! Faça seu primeiro acesso.' } 
      });
    } catch (err: any) {
      if (err.response?.data?.message) {
        setErro(err.response.data.message);
      } else if (err.response?.data?.error) {
        setErro(err.response.data.error);
      } else {
        setErro(err.message || 'Erro ao criar conta da empresa');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-background min-h-screen items-center justify-center p-8 bg-gradient-to-tr from-background via-background to-primary/5">
      <div className="w-full max-w-sm space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
           <button 
              onClick={() => navigate(-1)}
              className="mb-8 scale-90 hover:scale-100 transition-transform text-muted-foreground/40"
           >
              <ChevronLeft size={24} />
           </button>
           <h1 className="text-4xl font-display font-black tracking-tighter text-foreground">Sua Empresa<span className="text-primary italic">.</span></h1>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1 opacity-70">Passo 02: Dados Tributários</p>
        </div>

        <Card className="p-8 border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
          <form onSubmit={handleFinish} className="space-y-6">
            <div className="space-y-4">
              <Input 
                label="CNPJ da Organização"
                placeholder="00.000.000/0000-00" 
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                required
              />

              <Input 
                label="CEP da Sede"
                placeholder="00000-000" 
                value={cep}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2').substring(0, 9);
                  setCep(val);
                  if (val.replace(/\D/g, '').length === 8) buscarCep(val);
                }}
                required
              />

              <Input 
                label="Razão Social"
                placeholder="Ex: Minha Empresa LTDA" 
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
                required
              />

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">UF</label>
                    <select 
                      value={uf}
                      onChange={(e) => setUf(e.target.value)}
                      className="w-full h-11 bg-muted/40 border border-border/40 rounded-xl px-3 text-xs font-bold focus:outline-none focus:border-primary/50 transition-all appearance-none"
                    >
                      {ESTADOS_BRASILEIROS.map(e => (
                        <option key={e.value} value={e.value}>{e.value}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-span-2">
                  <Input 
                    label="Município"
                    placeholder="Cidade" 
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Input 
                label="Código Município (IBGE)"
                placeholder="Ex: 3550308" 
                value={codigoMunicipio}
                onChange={(e) => setCodigoMunicipio(e.target.value.replace(/\D/g, '').substring(0, 7))}
                required
              />
            </div>

            {erro && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest animate-in shake duration-300">
                <ShieldAlert size={16} />
                {erro}
              </div>
            )}

            <Button 
                type="submit" 
                className="w-full py-6 group" 
                disabled={loading}
                size="lg"
              >
                <div className="flex items-center gap-2">
                  {loading ? "Sincronizando..." : "Finalizar Cadastro"}
                  {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </div>
            </Button>
          </form>
        </Card>

        <div className="flex flex-col items-center space-y-4 pt-2">
            <p className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-[0.4em] flex items-center gap-2">
               <Building2 size={12} /> 
               Infraestrutura PlugNotas
            </p>
        </div>
      </div>
    </div>
  );
}
