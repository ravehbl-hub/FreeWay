// main.jsx: starting point of the React app - router + language + auth providers + global styles
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/dashboard.css';
import './styles/pages.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
