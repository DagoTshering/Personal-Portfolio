import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1d2e',
            color: '#f3f5fb',
            border: '1px solid rgba(255,255,255,0.12)',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
