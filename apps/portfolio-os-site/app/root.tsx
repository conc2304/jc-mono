import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type MetaFunction,
  type LinksFunction,
} from 'react-router';
import 'augmented-ui/augmented-ui.min.css';

import { EnhancedThemeProvider, enhancedThemes } from '@jc/themes';
// import { InitColorSchemeScript } from '@mui/material';

export const meta: MetaFunction = () => [
  {
    title: 'CLYZBY_OS V.1.0.0 | Portfolio Site',
  },
];

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* <InitColorSchemeScript defaultMode="system" /> */}

        <EnhancedThemeProvider
          themes={enhancedThemes}
          defaultThemeId="neon-cyberpunk"
          defaultColorMode="system"
          themeStorageKey="my-app-theme"
          colorModeStorageKey="my-app-color-mode"
        >
          {children}
        </EnhancedThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
