import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RoutesConfig from './routes';
import './App.css';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RoutesConfig />
      </ThemeProvider>
      <Toaster position="bottom-right" invert />
    </BrowserRouter>
  </React.StrictMode>
);
