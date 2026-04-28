import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { ShieldCheck, Zap, ChevronRight, Fingerprint } from 'lucide-react';

export default function SplashPage() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-black text-white p-8 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] right-[-20%] w-[120%] h-[60%] bg-primary/10 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[40%] bg-accent/5 rounded-full blur-[100px] opacity-30" />
      
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm space-y-12 z-10">
        
        {/* Logo Container */}
        <div className="relative group flex items-center justify-center">
             <img src="/logo-light.svg" alt="Logo Berith Light" className="w-28 h-28 object-contain" />
        </div>
        
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-display font-black tracking-tighter leading-[0.9] text-foreground">
            NF <br/> <span className="text-primary italic">Inteligente.</span>
          </h1>
          <p className="text-sm font-medium text-muted-foreground/80 leading-relaxed px-6 uppercase tracking-widest">
            A inteligência fiscal <br/> powered by berith pro.
          </p>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap justify-center gap-3 w-full">
           <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
              <ShieldCheck size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Compliance</span>
           </div>
           <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
              <Fingerprint size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Seguro</span>
           </div>
           <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
              <Zap size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Nativo</span>
           </div>
        </div>
      </div>
      
      <div className="w-full space-y-6 pb-12 z-10 flex flex-col items-center">
        <Button 
          onClick={() => navigate('/auth/login')} 
          className="w-full max-w-[280px] mx-auto py-8 text-xl font-black group shadow-2xl shadow-primary/20"
        >
          <div className="flex items-center gap-2">
             Acessar Plataforma
             <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Button>
        
        <div className="flex flex-col items-center gap-4">
           <button 
            onClick={() => navigate('/auth/cadastro')} 
            className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-white transition-colors"
          >
            Quero ser cliente NF Inteligente
          </button>
          <div className="h-px w-8 bg-white/10"></div>
          <p className="text-[8px] opacity-20 font-black tracking-[0.5em] uppercase">NF Inteligente v4.0 • Powered by Berith Pro</p>
        </div>
      </div>
    </div>
  );
}
