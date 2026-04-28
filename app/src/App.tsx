// FEATURE: App Root
// Responsabilidade: Iniciar o roteador completo do React Router v6
// NÃO faz: Camada de segurança e checagem de auth que vai ficar dentro do shell

import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
