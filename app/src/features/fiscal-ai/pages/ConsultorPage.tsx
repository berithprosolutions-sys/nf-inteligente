import { useState, useRef, useEffect } from 'react';
import { Send, ShieldCheck, ExternalLink, Cpu, User, History } from 'lucide-react';
import { fiscalAiService } from '../services/fiscalAiService';

interface Mensagem {
  id: string;
  role: 'user' | 'ia';
  texto: string;
  fonte?: string;
}

export default function ConsultorPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { id: '1', role: 'ia', texto: 'Olá! Sou a inteligência do NF Inteligente. Estou conectada às bases do RICMS, TIPI e normas da Receita Federal. O que vamos analisar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens, loading]);

  const consultar = async (pergunta?: string) => {
    const p = pergunta || input;
    if (!p) return;
    
    setInput('');
    setMensagens(prev => [...prev, { id: Date.now().toString(), role: 'user', texto: p }]);
    setLoading(true);
    
    try {
      const respostaIA = await fiscalAiService.consultar(p);
      const textoIa = respostaIA.resposta || respostaIA;
      const fonte = respostaIA.fontesUtilizadas && respostaIA.fontesUtilizadas[0] 
        ? respostaIA.fontesUtilizadas[0].lei 
        : 'Legislação Complementar';

      setMensagens(prev => [...prev, { id: Date.now().toString() + 'r', role: 'ia', texto: textoIa, fonte }]);
    } catch (err) {
      setMensagens(prev => [...prev, { id: Date.now().toString() + 'e', role: 'ia', texto: 'Desculpe, tive um problema na conexão. Pode repetir?' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Header Premium */}
      <header className="flex items-center justify-between bg-card/30 backdrop-blur-xl border-b border-white/5 px-6 py-5 shrink-0 safe-top">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
            <Cpu size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter uppercase italic">NF <span className="text-primary NOT-italic">Inteligente</span></h1>
            <div className="flex items-center gap-1.5">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Consultor Ativo</span>
            </div>
          </div>
        </div>
        <button className="h-10 w-10 rounded-xl bg-muted/20 flex items-center justify-center text-muted-foreground active:scale-95 transition-all">
          <History size={18} />
        </button>
      </header>
      
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scroll-smooth no-scrollbar"
      >
        {mensagens.map(msg => (
          <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse animate-in slide-in-from-right-4' : 'animate-in slide-in-from-left-4'}`}>
            <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-muted/50 text-muted-foreground'}`}>
               {msg.role === 'user' ? <User size={16} /> : <Cpu size={16} />}
            </div>
            
            <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-5 rounded-[1.5rem] shadow-sm text-sm font-medium leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-card border border-border/50 rounded-tl-none text-foreground/90 shadow-2xl shadow-black/5'
              }`}>
                {msg.texto}
              </div>
              
              {msg.fonte && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col gap-2 group cursor-pointer hover:bg-emerald-500/10 transition-all">
                   <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                      <ShieldCheck size={12} /> Embasamento Legal
                   </div>
                   <p className="text-[10px] font-bold text-foreground/60 leading-tight">
                      {msg.fonte}
                   </p>
                   <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink size={10} className="text-primary" />
                   </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-in fade-in duration-300">
             <div className="bg-card border border-border/50 rounded-2xl p-4 flex gap-1.5 items-center">
                <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce"></div>
                <div className="h-1.5 w-1.5 bg-primary/70 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
             </div>
          </div>
        )}
        {/* Espaço extra para não cobrir pela BottomNav */}
        <div className="h-32"></div>
      </div>

      {/* Input Area Premium */}
      <div className="shrink-0 p-6 bg-gradient-to-t from-background via-background to-transparent pt-12 absolute bottom-0 left-0 right-0 z-40 pb-24">
         <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
               <button onClick={() => consultar('NCM para Monitor Gamer?')} className="whitespace-nowrap px-4 py-2 bg-card border border-border/50 rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all shadow-sm">NCM Monitor</button>
               <button onClick={() => consultar('Notebook tem IPI?')} className="whitespace-nowrap px-4 py-2 bg-card border border-border/50 rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all shadow-sm">IPI Notebook</button>
               <button onClick={() => consultar('ISS em SP capital?')} className="whitespace-nowrap px-4 py-2 bg-card border border-border/50 rounded-full text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:border-primary/50 hover:text-primary transition-all shadow-sm">ISS SP</button>
            </div>
            
            <div className="relative group">
               <div className="absolute inset-0 bg-primary/10 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
               <div className="relative rounded-[2rem] bg-card border border-border/50 p-2 shadow-2xl flex items-center gap-2 group-focus-within:border-primary/30 transition-all">
                  <input 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && consultar()} 
                    placeholder="Pergunte à IA do NF Inteligente..." 
                    className="flex-1 bg-transparent px-6 py-4 text-sm font-medium focus:outline-none placeholder:text-muted-foreground/40 placeholder:uppercase placeholder:text-[10px] placeholder:font-black placeholder:tracking-widest"
                  />
                  <button 
                    onClick={() => consultar()}
                    className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 transition-all disabled:opacity-50"
                    disabled={!input.trim()}
                  >
                    <Send size={18} />
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
