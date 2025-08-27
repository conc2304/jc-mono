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
        <EnhancedThemeProvider
          themes={enhancedThemes}
          defaultThemeId="developer-terminal"
          defaultColorMode="system"
          themeStorageKey="clyzby-app-theme"
          colorModeStorageKey="clyzby-app-color-mode"
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
