import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Newspaper, ExternalLink, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';
import { alertasService, AlertaFiscal } from '../services/alertasService';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { useNavigate } from 'react-router-dom';

const CATEGORIA_LABEL: Record<string, string> = {
  NF_E: 'NF-e',
  ICMS: 'ICMS',
  SIMPLES_NACIONAL: 'Simples Nac.',
  MEI: 'MEI',
  LEGISLACAO: 'Legislação',
  GERAL: 'Geral',
};

const CATEGORIA_COLOR: Record<string, "success" | "warning" | "danger" | "info" | "primary" | "outline"> = {
  NF_E: 'primary',
  ICMS: 'warning',
  SIMPLES_NACIONAL: 'success',
  MEI: 'info',
  LEGISLACAO: 'danger',
  GERAL: 'outline',
};

export default function AlertasFiscaisPage() {
  const [alertas, setAlertas] = useState<AlertaFiscal[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [recarregando, setRecarregando] = useState(false);
  const navigate = useNavigate();

  const carregar = async () => {
    try {
      setErro(null);
      const dados = await alertasService.listar(30);
      setAlertas(dados);
    } catch {
      setErro('Não foi possível carregar as notícias. Tente atualizar a página.');
    } finally {
      setCarregando(false);
      setRecarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleRefresh = async () => {
    setRecarregando(true);
    await carregar();
  };

  const abrirNoticia = (url: string) => {
    window.open(url, '_blank');
  };

  const formatarData = (dataStr: string | null): string => {
    if (!dataStr) return '';
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(dataStr));
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-32">
      {/* Absolute Header with Back Button */}
      <div className="flex items-center justify-between p-6">
          <button 
            onClick={() => navigate(-1)}
            className="h-12 w-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-foreground active:scale-90 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-12 h-12"></div>
      </div>

      <div className="px-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-display font-extrabold text-foreground flex items-center gap-3">
              <Newspaper className="h-8 w-8 text-primary" />
              Alertas Fiscais
            </h1>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={recarregando || carregando}
              className="rounded-xl h-10 w-10 border-border/50 bg-card p-0 flex items-center justify-center"
            >
              <RefreshCw className={`h-4 w-4 ${recarregando ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Acompanhe as novidades tributárias e fiscais relevantes atualizadas diariamente.
          </p>
        </div>

        {carregando ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-none shadow-sm bg-card/50 h-32 animate-pulse" />
            ))}
          </div>
        ) : erro ? (
          <Card className="border-destructive/30 bg-destructive/10">
            <CardHeader className="text-center space-y-2 py-8">
              <AlertTriangle className="h-10 w-10 text-destructive mx-auto" />
              <CardTitle className="text-destructive">Erro de Conexão</CardTitle>
              <CardDescription className="text-destructive/80 font-medium">
                {erro}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : alertas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
            <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center">
              <Newspaper className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Nenhuma notícia encontrada</p>
              <p className="text-sm text-muted-foreground mt-1">O radar fiscal parece estar tranquilo hoje.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {alertas.map((alerta) => (
              <Card 
                key={alerta.id} 
                className="cursor-pointer hover:bg-accent/30 transition-all border-none shadow-sm active:scale-[0.98] overflow-hidden group"
                onClick={() => abrirNoticia(alerta.urlOriginal)}
              >
                {alerta.urlImagem && (
                  <div className="h-32 w-full truncate relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <img 
                      src={alerta.urlImagem} 
                      alt={alerta.titulo} 
                      className="object-cover w-full h-full"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
                
                <CardHeader className={`${alerta.urlImagem ? 'pt-4' : 'pt-6'} pb-4 px-5`}>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={CATEGORIA_COLOR[alerta.categoria] || 'outline'} className="text-[10px] uppercase font-bold tracking-wider rounded-lg">
                      {CATEGORIA_LABEL[alerta.categoria] || alerta.categoria}
                    </Badge>
                    {alerta.publicadoEm && (
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {formatarData(alerta.publicadoEm)}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                    {alerta.titulo}
                  </CardTitle>
                  {alerta.fonte && (
                    <CardDescription className="text-xs font-semibold mt-1">
                      Fonte: {alerta.fonte}
                    </CardDescription>
                  )}
                </CardHeader>
                {alerta.resumo && (
                  <CardContent className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {alerta.resumo}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-xs font-bold text-primary uppercase tracking-widest">
                      Ler na íntegra
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
