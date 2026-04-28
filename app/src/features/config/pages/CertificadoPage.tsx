import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Input } from '@/shared/components/ui/Input';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { ShieldCheck, Trash2, Calendar, FileType, ChevronLeft, ShieldAlert, UploadCloud, AlertCircle } from 'lucide-react';
import { certificadoService, CertificadoStatus } from '../services/certificadoService';

export default function CertificadoPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<CertificadoStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [senha, setSenha] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarStatus();
  }, []);

  const carregarStatus = async () => {
    setIsLoading(true);
    setErro(null);
    try {
      const resp = await certificadoService.getStatus();
      setStatus(resp);
    } catch (err: any) {
      setErro('Erro ao carregar status do certificado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !senha) return;
    setIsUploading(true);
    setErro(null);
    try {
      await certificadoService.upload(file, senha);
      await carregarStatus();
      setSenha('');
      setFile(null);
    } catch (err: any) {
      setErro(err?.response?.data?.message || err?.message || 'Erro ao realizar upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemover = async () => {
    setErro(null);
    try {
      setIsLoading(true);
      await certificadoService.remover();
      await carregarStatus();
    } catch (err: any) {
      setErro('Erro ao remover certificado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !status) return <div className="flex h-screen items-center justify-center bg-background"><LoadingSpinner /></div>;

  return (
    <div className="p-6 space-y-8 pb-28 min-h-screen bg-background">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="h-12 w-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-foreground active:scale-90 transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black font-display tracking-tighter">Certificado Digital</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">Segurança & Emissão</p>
        </div>
      </div>

      {erro && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive text-[10px] font-black uppercase tracking-widest animate-pulse">
          <ShieldAlert size={16} />
          {erro}
        </div>
      )}

      {status?.temCertificado ? (
        <div className="space-y-6">
          <Card className="overflow-hidden border-none shadow-2xl shadow-emerald-500/10 bg-card/50 backdrop-blur-xl">
            <div className="bg-emerald-500/10 p-8 flex flex-col items-center border-b border-emerald-500/10">
               <div className="h-24 w-24 rounded-[2rem] bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4 animate-in zoom-in duration-700">
                  <ShieldCheck size={48} />
               </div>
               <div className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Protegido & Ativo</div>
            </div>
            
            <div className="p-8 space-y-6">
               <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Titular do Certificado</p>
                    <p className="text-sm font-black text-foreground uppercase truncate tracking-tight">{status.subject}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 flex items-center">
                        <Calendar size={12} className="mr-1 text-emerald-500"/> Expiração
                      </p>
                      <p className="text-sm font-black text-foreground">
                        {status.vencimento ? new Date(status.vencimento).toLocaleDateString('pt-BR') : '---'}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/40">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 text-primary flex items-center">
                        Modelo
                      </p>
                      <p className="text-sm font-black text-foreground italic">Arquivado A1</p>
                    </div>
                  </div>
               </div>

               <Button 
                variant="outline" 
                onClick={handleRemover}
                className="w-full py-7 group border-destructive/20 text-destructive hover:bg-destructive hover:text-white rounded-[1.5rem]"
              >
                <div className="flex items-center gap-2">
                  <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="font-black uppercase tracking-widest text-[10px]">Excluir este certificado</span>
                </div>
              </Button>
            </div>
          </Card>

          <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 flex gap-4">
             <AlertCircle className="text-amber-500 shrink-0" size={24} />
             <p className="text-[10px] font-medium text-amber-700/70 leading-relaxed">
               <strong>Atenção:</strong> A remoção do certificado impedirá qualquer emissão de nota fiscal em ambiente de produção imediatamente.
             </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <Card className="p-10 text-center border-2 border-dashed border-border/40 bg-card/30 rounded-[2.5rem]">
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-[1.5rem] bg-muted/50 flex items-center justify-center text-muted-foreground/30 mb-6">
                 <FileType size={40} />
              </div>
              <h3 className="font-black text-foreground tracking-tight text-xl">Certificado não encontrado</h3>
              <p className="text-xs text-muted-foreground mt-2 max-w-[220px] mx-auto leading-relaxed">
                Faça o upload do seu certificado <strong>modelo A1 (.pfx)</strong> para habilitar emissões.
              </p>
            </div>
          </Card>

          <div className="space-y-6">
             <div className="space-y-4">
                <div className="relative group">
                   <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 px-1">Arquivo Digital (.pfx / .p12)</p>
                   <div className="relative overflow-hidden cursor-pointer">
                      <input 
                        type="file" 
                        accept=".pfx,.p12"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                      />
                      <div className="border-2 border-border/60 group-hover:border-primary/40 rounded-3xl p-6 bg-card/50 backdrop-blur-sm flex flex-col items-center justify-center transition-all">
                         <UploadCloud size={32} className="text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
                         <span className="text-xs font-bold text-foreground">
                            {file ? file.name : "Toque para selecionar arquivo"}
                         </span>
                      </div>
                   </div>
                </div>

                <Input 
                   label="Senha do Recipiente"
                   type="password"
                   placeholder="••••••••••••"
                   value={senha}
                   onChange={(e) => setSenha(e.target.value)}
                />
             </div>

             <Button 
                onClick={handleUpload}
                disabled={!file || !senha || isUploading}
                className="w-full py-8 group shadow-2xl shadow-primary/20"
             >
                <div className="flex items-center gap-2">
                   {isUploading ? <LoadingSpinner /> : (
                      <>
                        <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="font-black uppercase tracking-widest text-xs">Instalar com Segurança</span>
                      </>
                   )}
                </div>
             </Button>
          </div>
        </div>
      )}
    </div>
  );
}
