import { StrictMode } from 'react';
import { ThemeProvider } from '@jc/theming';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';

import './styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <ThemeProvider defaultTheme="cyberpunk">
      <App />
    </ThemeProvider>
  </StrictMode>
);
