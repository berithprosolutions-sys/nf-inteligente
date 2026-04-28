import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import type { Usuario } from '../types/auth.types';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Card } from '@/shared/components/ui/Card';
import { Eye, EyeOff, ShieldCheck, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');
    try {
      const data = await authService.login(email, password);
      const { usuario, tokens } = data;
      login(
        { ...usuario, role: usuario.role as Usuario['role'] },
        usuario.empresa,
        tokens
      );
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.message) {
        setErro(err.response.data.message);
      } else if (err.response?.data?.error) {
        setErro(err.response.data.error);
      } else {
        const msg = err instanceof Error ? err.message : 'Credenciais inválidas';
        setErro(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-background min-h-screen items-center justify-center p-8 bg-gradient-to-tr from-background via-background to-primary/5">
      <div className="w-full max-w-sm space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group cursor-pointer flex items-center justify-center">
               <img src="/logo-dark.svg" alt="Logo Berith Dark" className="h-28 w-28 object-contain dark:hidden" />
               <img src="/logo-light.svg" alt="Logo Berith Light" className="h-28 w-28 object-contain hidden dark:block" />
          </div>
          <h1 className="text-4xl font-display font-black tracking-tighter text-foreground mt-8">NF<span className="text-primary italic">.</span>Inteligente</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1 opacity-70">A inteligência fiscal da Berith Pro</p>
        </div>

        <Card className="p-8 border-border/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input 
                  label="Seu Identificador (E-mail)"
                  type="email" 
                  placeholder="ex: gestor@berith.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="relative">
                <Input 
                  label="Senha de Acesso"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bottom-3.5 text-muted-foreground/50 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {erro && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/5 text-destructive text-[10px] font-black uppercase tracking-widest border border-destructive/10 animate-in shake duration-300">
                <ShieldCheck size={14} />
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
                {loading ? "Processando..." : "Entrar na Plataforma"}
                {!loading && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </div>
            </Button>
          </form>
        </Card>

        <div className="flex flex-col items-center space-y-4 pt-2">
           <button 
              onClick={() => navigate('/auth/cadastro')}
              className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors"
            >
              Criar minha conta gratuita
            </button>
            <div className="h-px w-8 bg-border/50"></div>
            <p className="text-[9px] text-muted-foreground/40 font-medium uppercase tracking-[0.2em]">Criptografia ponta-a-ponta</p>
        </div>
      </div>
    </div>
  );
}
