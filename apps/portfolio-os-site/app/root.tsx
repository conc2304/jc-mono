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
    title: 'Jose Conchello | Portfolio Site',
  },
  // Additional meta tags for better favicon support
  {
    name: 'theme-color',
    content: '#000000', // Replace with your brand color
  },
  {
    name: 'msapplication-TileColor',
    content: '#000000', // Replace with your brand color
  },
];

export const links: LinksFunction = () => [
  // Font preconnects
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },

  // Favicon links
  {
    rel: 'icon',
    type: 'image/x-icon',
    href: '/favicon.ico',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicon-16x16.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '48x48',
    href: '/favicon-48x48.png',
  },

  // Apple Touch Icons
  {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/apple-touch-icon.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '152x152',
    href: '/apple-touch-icon-152x152.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '144x144',
    href: '/apple-touch-icon-144x144.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '120x120',
    href: '/apple-touch-icon-120x120.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '114x114',
    href: '/apple-touch-icon-114x114.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '76x76',
    href: '/apple-touch-icon-76x76.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '72x72',
    href: '/apple-touch-icon-72x72.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '60x60',
    href: '/apple-touch-icon-60x60.png',
  },
  {
    rel: 'apple-touch-icon',
    sizes: '57x57',
    href: '/apple-touch-icon-57x57.png',
  },

  // Android Chrome icons
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '192x192',
    href: '/android-chrome-192x192.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '512x512',
    href: '/android-chrome-512x512.png',
  },

  // Web App Manifest
  {
    rel: 'manifest',
    href: '/site.webmanifest',
  },

  // Safari Pinned Tab
  {
    rel: 'mask-icon',
    href: '/safari-pinned-tab.svg',
    color: '#000000', // Replace with your brand color
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
