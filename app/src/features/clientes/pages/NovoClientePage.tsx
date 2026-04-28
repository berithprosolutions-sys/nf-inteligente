import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';
import { clientesService } from '../services/clientesService';
import { ChevronLeft, CheckCircle2, ShieldAlert, MapPin, Search } from 'lucide-react';

type TipoCliente = 'PF' | 'PJ';

function formatarDocumento(valor: string, tipo: TipoCliente): string {
  const nums = valor.replace(/\D/g, '');
  if (tipo === 'PF') {
    return nums.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').substring(0, 14);
  }
  return nums.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5').substring(0, 18);
}

function formatarCep(valor: string): string {
  const nums = valor.replace(/\D/g, '');
  return nums.replace(/(\d{5})(\d{3})/, '$1-$2').substring(0, 9);
}

import { ESTADOS_BRASILEIROS } from '@/shared/constants/estados';

export default function NovoClientePage() {
  const navigate = useNavigate();

  const [tipo, setTipo] = useState<TipoCliente>('PJ');
  const [documento, setDocumento] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  // Endereço
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [codigoMunicipio, setCodigoMunicipio] = useState('');
  const [uf, setUf] = useState('SP');
  const [cep, setCep] = useState('');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscarCep = async () => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setLogradouro(data.logradouro);
        setBairro(data.bairro);
        setMunicipio(data.localidade);
        setUf(data.uf);
        setCodigoMunicipio(data.ibge);
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  };

  const limparDocumento = (doc: string) => doc.replace(/\D/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    const docLimpo = limparDocumento(documento);
    const docEsperado = tipo === 'PF' ? 11 : 14;
    if (docLimpo.length !== docEsperado) {
      setErro(`${tipo === 'PF' ? 'CPF' : 'CNPJ'} inválido.`);
      return;
    }

    setLoading(true);
    try {
      await clientesService.criar({
        tipo,
        documento: docLimpo,
        nome,
        email: email || undefined,
        telefone: telefone || undefined,
        enderecoCompleto: {
          logradouro,
          numero,
          bairro,
          municipio,
          uf,
          cep: cep.replace(/\D/g, ''),
          codigoMunicipio,
        },
      });
      navigate('/clientes');
    } catch (err: any) {
      setErro(err?.response?.data?.message ?? err?.message ?? 'Erro ao salvar cliente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-lg mx-auto pb-24">
      {/* Header com Navegação */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/clientes')}
          className="h-12 w-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-foreground active:scale-90 transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black font-display tracking-tighter">Novo Cliente</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Adicionar à base fiscal</p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Card className="p-2 border-none shadow-2xl shadow-black/5 bg-card/80 backdrop-blur-md">
          <div className="p-4 space-y-6">
            
            {/* Seletor Tipo PF/PJ */}
            <div className="flex bg-muted/40 p-1.5 rounded-[1.5rem] border border-border/20">
              {(['PJ', 'PF'] as TipoCliente[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTipo(t); setDocumento(''); }}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${tipo === t
                      ? 'bg-card text-primary shadow-sm'
                      : 'text-muted-foreground/60 hover:text-foreground'
                    }`}
                >
                  {t === 'PF' ? 'Indivíduo' : 'Empresa'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <Input
                label={tipo === 'PF' ? 'Documento CPF' : 'Documento CNPJ'}
                placeholder={tipo === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
                value={documento}
                onChange={(e) => setDocumento(formatarDocumento(e.target.value, tipo))}
                required
              />

              <Input
                label={tipo === 'PF' ? 'Nome Completo' : 'Razão Social'}
                placeholder="Ex: Nome do Cliente"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="contato@..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  label="Contato"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Seção de Endereço */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center px-2">
             <MapPin size={12} className="text-primary mr-2" />
             <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Endereço Fiscal</h2>
          </div>
          
          <Card className="p-6 border-none shadow-xl shadow-black/5">
            <div className="space-y-4">
              <div className="relative group">
                <Input
                  label="Localizar CEP"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => {
                    const val = formatarCep(e.target.value);
                    setCep(val);
                    if (val.replace(/\D/g, '').length === 8) {
                      buscarCep();
                    }
                  }}
                  maxLength={9}
                />
                <button 
                  type="button" 
                  onClick={buscarCep}
                  className="absolute right-4 bottom-3 text-primary hover:scale-110 transition-transform"
                >
                   <Search size={18} />
                </button>
              </div>

              <Input
                label="Logradouro"
                placeholder="Rua, Av..."
                value={logradouro}
                onChange={(e) => setLogradouro(e.target.value)}
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Nº"
                  placeholder="123"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
                <div className="col-span-2">
                  <Input
                    label="Bairro"
                    placeholder="Setor..."
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-3">
                  <Input
                    label="Município"
                    placeholder="Cidade"
                    value={municipio}
                    onChange={(e) => setMunicipio(e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">UF</label>
                    <select 
                      value={uf}
                      onChange={(e) => setUf(e.target.value)}
                      className="w-full h-11 bg-muted/40 border border-border/40 rounded-xl px-2 text-xs font-bold focus:outline-none focus:border-primary/50 transition-all appearance-none"
                    >
                      {ESTADOS_BRASILEIROS.map(e => (
                        <option key={e.value} value={e.value}>{e.value}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {erro && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest animate-in shake duration-300">
            <ShieldAlert size={16} />
            {erro}
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-7 group"
          isLoading={loading}
        >
          <div className="flex items-center gap-2">
             {!loading && <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />}
             {loading ? 'Salvando...' : 'Finalizar Cadastro'}
          </div>
        </Button>
      </form>
    </div>
  );
}
