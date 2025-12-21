import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import 'augmented-ui/augmented-ui.min.css';

import { EnhancedThemeProvider, enhancedThemes } from '@jc/themes';
import { ThemedBgContainer } from './components/themed-bg-container';
import {
  CloudflareMediaProvider,
  LoadingFallback,
  MediaProvider,
  ErrorBoundary,
} from '@jc/ui-components';
import { Box } from '@mui/material';
import { metaDescriptors, structuredData, linkDescriptors } from './config/seo';
import type { MetaFunction, LinksFunction } from 'react-router';

export const meta: MetaFunction = () => metaDescriptors;
export const links: LinksFunction = () => linkDescriptors;

const mediaProviderService = new CloudflareMediaProvider();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Add JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

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
          <ErrorBoundary>
            <MediaProvider
              provider={mediaProviderService}
              defaultContext="gallery"
            >
              <ThemedBgContainer />
              {children}
            </MediaProvider>
          </ErrorBoundary>
        </EnhancedThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <Box
      className="hydrate-fallback"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Light mode gradient
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
        color: '#000000',
        // Dark mode gradient
        '@media (prefers-color-scheme: dark)': {
          background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
          color: '#ffffff',
          '& .loading-message': {
            color: '#ffffff',
          },
        },
      }}
    >
      <LoadingFallback message="Loading Jose Conchello's Portfolio Site:" />
    </Box>
  );
}

export default function App() {
  return <Outlet />;
}
