// FEATURE: App Inicializer
// Responsabilidade: Inserir a app web na div raiz com suporte a react estrito
// NÃO faz: Gestão de rotas, que fica no router/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './shared/providers/theme-provider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
