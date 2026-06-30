import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App.tsx';
import './index.css';
import { HelmetProvider } from "react-helmet-async";
import { initPostHog } from './lib/posthog';

initPostHog();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
      <App />
      </HelmetProvider>
    </Provider>
  </StrictMode>
);
