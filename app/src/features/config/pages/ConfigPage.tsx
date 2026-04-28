import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useTheme } from '@/shared/providers/theme-provider';
import { Sun, Moon, Monitor, LogOut, ShieldCheck, Building2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConfigPage() {
  const navigate = useNavigate();
  const { logout, empresa } = useAuthStore();
  const { theme, setTheme } = useTheme();
  
  const handleLogout = () => {
    logout();
    navigate('/auth/splash');
  };

  return (
    <div className="p-4 space-y-6 bg-background min-h-screen text-foreground">
      <div className="mt-4">
         <h1 className="text-3xl font-display font-extrabold text-primary">Configurações</h1>
         <p className="text-sm text-muted-foreground">Ambiente operado sob: {empresa?.razaoSocial || 'Empresa Teste'}</p>
      </div>

      <div className="space-y-4">
        {/* Seção de Tema */}
        <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sun className="h-5 w-5 text-accent" />
              Aparência
            </CardTitle>
            <CardDescription>Escolha o tema visual do aplicativo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex bg-muted p-1 rounded-xl w-full">
              <button 
                onClick={() => setTheme("light")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${theme === 'light' ? 'bg-background shadow-md text-primary font-bold' : 'text-muted-foreground hover:bg-background/20'}`}
              >
                <Sun size={18} />
                <span className="text-sm">Claro</span>
              </button>
              <button 
                onClick={() => setTheme("dark")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${theme === 'dark' ? 'bg-background shadow-md text-primary font-bold' : 'text-muted-foreground hover:bg-background/20'}`}
              >
                <Moon size={18} />
                <span className="text-sm">Escuro</span>
              </button>
              <button 
                onClick={() => setTheme("system")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all ${theme === 'system' ? 'bg-background shadow-md text-primary font-bold' : 'text-muted-foreground hover:bg-background/20'}`}
              >
                <Monitor size={18} />
                <span className="text-sm">Auto</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Links de Configuração */}
        <div className="grid gap-3">
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-none shadow-sm" onClick={() => navigate('/config/empresa')}>
             <CardHeader className="p-5 flex flex-row items-center gap-4 space-y-0">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Informações Jurídicas</CardTitle>
                  <CardDescription>Dados da empresa e SEFAZ</CardDescription>
                </div>
             </CardHeader>
          </Card>
          
          <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-none shadow-sm" onClick={() => navigate('/config/certificado')}>
             <CardHeader className="p-5 flex flex-row items-center gap-4 space-y-0">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Certificado A1 
                    <span className="text-[10px] font-mono bg-green-500/10 text-green-600 px-2 rounded-full border border-green-500/20">ATIVO</span>
                  </CardTitle>
                  <CardDescription>Validade e credenciais de segurança</CardDescription>
                </div>
             </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-none shadow-sm" onClick={() => navigate('/config/plano')}>
             <CardHeader className="p-5 flex flex-row items-center gap-4 space-y-0">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Plano e Faturamento</CardTitle>
                  <CardDescription>Licenças e expansão de IA</CardDescription>
                </div>
             </CardHeader>
          </Card>
        </div>
      </div>

      <div className="pt-8">
        <Button variant="ghost" className="w-full h-14 text-destructive hover:text-destructive hover:bg-destructive/10 font-bold gap-3 text-lg rounded-2xl" onClick={handleLogout}>
          <LogOut size={20} />
          Encerrar Atendimento Seguro
        </Button>
        <p className="text-center text-[10px] text-muted-foreground mt-4 uppercase tracking-widest font-mono">NF Inteligente v4.0 • Powered by Berith Pro</p>
      </div>
    </div>
  );
}
