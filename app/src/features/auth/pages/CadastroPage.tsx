import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';
import { ChevronRight, ChevronLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function CadastroPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    navigate('/auth/empresa', { 
      state: { nome, email, password } 
    });
  };

  return (
    <div className="flex bg-background min-h-screen items-center justify-center p-8 bg-gradient-to-tr from-background via-background to-primary/5">
      <div className="w-full max-w-sm space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
           <button 
              onClick={() => navigate('/auth')}
              className="mb-8 scale-90 hover:scale-100 transition-transform text-muted-foreground/40"
           >
              <ChevronLeft size={24} />
           </button>
           <h1 className="text-4xl font-display font-black tracking-tighter text-foreground">Sua Jornada<span className="text-primary italic">.</span></h1>
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1 opacity-70">Passo 01: Identificação Pessoal</p>
        </div>

        <Card className="p-8 border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
          <form onSubmit={handleContinue} className="space-y-6">
            <div className="space-y-4">
              <Input 
                label="Qual seu nome?"
                placeholder="Ex: João da Silva" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <Input 
                label="Melhor E-mail"
                type="email"
                placeholder="ex: voce@empresa.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input 
                label="Criar Senha"
                type="password"
                placeholder="••••••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-3 py-2">
                <div className="flex items-center gap-2 text-[9px] text-muted-foreground font-black uppercase tracking-widest bg-muted/30 px-3 py-2 rounded-xl">
                  <ShieldCheck size={12} className="text-primary" /> Conformidade LGPD Ativa
                </div>
            </div>

            <Button 
                type="submit" 
                className="w-full py-6 group" 
                disabled={loading}
                size="lg"
              >
                <div className="flex items-center gap-2">
                  {loading ? "Preparando..." : "Continuar Cadastro"}
                  {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </div>
            </Button>
          </form>
        </Card>

        <div className="flex flex-col items-center space-y-4 pt-2">
            <p className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-[0.2em] flex items-center gap-2">
               <Sparkles size={12} className="text-primary" /> 
               Grátis por tempo limitado
            </p>
        </div>
      </div>
    </div>
  );
}
