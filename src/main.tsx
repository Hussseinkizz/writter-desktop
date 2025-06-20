import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RoutesConfig from './routes';
import './App.css';
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <RoutesConfig />
      <Toaster position="bottom-right" invert />
    </BrowserRouter>
  </React.StrictMode>
);
