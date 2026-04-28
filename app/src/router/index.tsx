// FEATURE: Roteamento Base
// Responsabilidade: Gerenciar todas as 32 rotas do painel via react-router v6
// NÃO faz: Guardas isoladas e validações internas (deixo nos componentes de layout)

import { createBrowserRouter } from 'react-router-dom';

// Import local para suprimir erros globais enquanto criamos as paginas
import AppShell from '@/shared/components/layout/AppShell';

// Lote 3
import SplashPage from '@/features/auth/pages/SplashPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import CadastroPage from '@/features/auth/pages/CadastroPage';
import EmpresaPage from '@/features/auth/pages/EmpresaPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';

// Lote 4
import ClientesPage from '@/features/clientes/pages/ClientesPage';
import NovoClientePage from '@/features/clientes/pages/NovoClientePage';
import DetalheClientePage from '@/features/clientes/pages/DetalheClientePage';
import ProdutosPage from '@/features/produtos/pages/ProdutosPage';
import NovoProdutoPage from '@/features/produtos/pages/NovoProdutoPage';
import NcmSugestaoPage from '@/features/produtos/pages/NcmSugestaoPage';
import PainelFiscalPage from '@/features/produtos/pages/PainelFiscalPage';
import ServicosPage from '@/features/servicos/pages/ServicosPage';
import NovoServicoPage from '@/features/servicos/pages/NovoServicoPage';
import Lc116SugestaoPage from '@/features/servicos/pages/Lc116SugestaoPage';

// Lote 5
import TipoNotaPage from '@/features/emissao/pages/TipoNotaPage';
import ClienteNfePage from '@/features/emissao/pages/nfe/ClienteNfePage';
import ItensNfePage from '@/features/emissao/pages/nfe/ItensNfePage';
import RevisaoNfePage from '@/features/emissao/pages/nfe/RevisaoNfePage';
import ConfirmacaoNfePage from '@/features/emissao/pages/nfe/ConfirmacaoNfePage';
import ClienteNfsePage from '@/features/emissao/pages/nfse/ClienteNfsePage';
import ServicoNfsePage from '@/features/emissao/pages/nfse/ServicoNfsePage';
import RevisaoNfsePage from '@/features/emissao/pages/nfse/RevisaoNfsePage';
import ResultadoPage from '@/features/emissao/pages/resultado/ResultadoPage';
import PdfPage from '@/features/emissao/pages/resultado/PdfPage';
import XmlPage from '@/features/emissao/pages/resultado/XmlPage';
import LicencaExpiradaPage from '@/features/assinatura/pages/LicencaExpiradaPage';

// Lote 4 - Fiscal/Config
import ConsultorPage from '@/features/fiscal-ai/pages/ConsultorPage';
import ResultadoConsultaPage from '@/features/fiscal-ai/pages/ResultadoConsultaPage';
import TabelaNcmPage from '@/features/fiscal-ai/pages/TabelaNcmPage';
import DetalheNcmPage from '@/features/fiscal-ai/pages/DetalheNcmPage';
import ConfigPage from '@/features/config/pages/ConfigPage';
import EmpresaConfigPage from '@/features/config/pages/EmpresaConfigPage';
import CertificadoPage from '@/features/config/pages/CertificadoPage';
import PlanoPage from '@/features/config/pages/PlanoPage';
import AlertasFiscaisPage from '@/features/alertas-fiscais/pages/AlertasFiscaisPage';

import PrivateRoute from '@/shared/components/layout/PrivateRoute';

export const router = createBrowserRouter([
  { path: '/auth/splash', element: <SplashPage /> },
  { path: '/auth/login', element: <LoginPage /> },
  { path: '/auth/cadastro', element: <CadastroPage /> },
  { path: '/auth/empresa', element: <EmpresaPage /> },
  { path: '/licenca-expirada', element: <LicencaExpiradaPage /> },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'clientes', element: <ClientesPage /> },
          { path: 'clientes/novo', element: <NovoClientePage /> },
          { path: 'clientes/:id', element: <DetalheClientePage /> },
      { path: 'produtos', element: <ProdutosPage /> },
      { path: 'produtos/novo', element: <NovoProdutoPage /> },
      { path: 'produtos/:id/ncm', element: <NcmSugestaoPage /> },
      { path: 'produtos/:id/fiscal', element: <PainelFiscalPage /> },
      { path: 'servicos', element: <ServicosPage /> },
      { path: 'servicos/novo', element: <NovoServicoPage /> },
      { path: 'servicos/:id/lc116', element: <Lc116SugestaoPage /> },
      { path: 'emissao', element: <TipoNotaPage /> },
      { path: 'emissao/nfe/cliente', element: <ClienteNfePage /> },
      { path: 'emissao/nfe/itens', element: <ItensNfePage /> },
      { path: 'emissao/nfe/revisao', element: <RevisaoNfePage /> },
      { path: 'emissao/nfe/confirmacao', element: <ConfirmacaoNfePage /> },
      { path: 'emissao/nfse/cliente', element: <ClienteNfsePage /> },
      { path: 'emissao/nfse/servico', element: <ServicoNfsePage /> },
      { path: 'emissao/nfse/revisao', element: <RevisaoNfsePage /> },
      { path: 'emissao/resultado/:id', element: <ResultadoPage /> },
      { path: 'emissao/resultado/:id/pdf', element: <PdfPage /> },
      { path: 'emissao/resultado/:id/xml', element: <XmlPage /> },
      { path: 'fiscal', element: <ConsultorPage /> },
      { path: 'fiscal/resultado', element: <ResultadoConsultaPage /> },
      { path: 'fiscal/ncm', element: <TabelaNcmPage /> },
      { path: 'fiscal/ncm/:codigo', element: <DetalheNcmPage /> },
      { path: 'config', element: <ConfigPage /> },
          { path: 'config/empresa', element: <EmpresaConfigPage /> },
          { path: 'config/certificado', element: <CertificadoPage /> },
          { path: 'config/plano', element: <PlanoPage /> },
          { path: 'alertas-fiscais', element: <AlertasFiscaisPage /> }
        ]
      }
    ]
  }
]);
