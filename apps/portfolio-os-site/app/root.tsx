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
import { ThemedBgContainer } from './components/themed-bg-container';
import { CloudflareMediaProvider, MediaProvider } from '@jc/ui-components';

export const meta: MetaFunction = () => [
  // Basic meta tags
  {
    title: 'Jose Conchello | Full-Stack Developer & Creative Technologist',
  },
  {
    name: 'description',
    content:
      'Full-Stack UI Engineer with 10+ years experience specializing in React, Next.js, and TypeScript. Expert in enterprise architectures, creative technology, game development, and immersive installations. Based in Oakland, CA.',
  },
  {
    name: 'keywords',
    content:
      'Full-Stack Developer, React Developer, Next.js, TypeScript, Creative Technologist, UI Engineer, Frontend Engineer, Game Development, Unity, Three.js, P5.js, Immersive Installations, Enterprise Architecture, Oakland Developer',
  },
  {
    name: 'author',
    content: 'Jose Conchello',
  },
  {
    name: 'robots',
    content: 'index, follow',
  },
  {
    name: 'language',
    content: 'en-US',
  },

  // Open Graph tags
  {
    property: 'og:type',
    content: 'website',
  },
  {
    property: 'og:title',
    content: 'Jose Conchello | Full-Stack Developer & Creative Technologist',
  },
  {
    property: 'og:description',
    content:
      'Full-Stack UI Engineer with 10+ years experience specializing in React, Next.js, and TypeScript. Expert in enterprise architectures, creative technology, game development, and immersive installations.',
  },
  {
    property: 'og:url',
    content: 'https://www.clyzby.com/',
  },
  {
    property: 'og:site_name',
    content: 'Jose Conchello Portfolio',
  },
  {
    property: 'og:image',
    content: 'https://www.clyzby.com/og-image.jpg', // 1200x630px recommended
  },
  {
    property: 'og:image:secure_url',
    content: 'https://www.clyzby.com/og-image.jpg',
  },
  {
    property: 'og:image:width',
    content: '1200',
  },
  {
    property: 'og:image:height',
    content: '630',
  },
  {
    property: 'og:image:alt',
    content: 'Jose Conchello - Full-Stack Developer & Creative Technologist',
  },
  {
    property: 'og:locale',
    content: 'en_US',
  },

  // Twitter/X Card tags
  {
    name: 'twitter:card',
    content: 'summary_large_image',
  },
  {
    name: 'twitter:title',
    content: 'Jose Conchello | Full-Stack Developer & Creative Technologist',
  },
  {
    name: 'twitter:description',
    content:
      'Full-Stack UI Engineer specializing in React, Next.js, TypeScript. Expert in creative technology, game development, and immersive installations.',
  },
  {
    name: 'twitter:image',
    content: 'https://www.clyzby.com/og-image.jpg', // Same as OG image
  },
  {
    name: 'twitter:image:alt',
    content: 'Jose Conchello - Full-Stack Developer & Creative Technologist',
  },
  {
    name: 'twitter:creator',
    content: '@your_twitter_handle', // Replace with your Twitter handle if you have one
  },

  // Additional SEO tags
  {
    name: 'geo.region',
    content: 'US-CA',
  },
  {
    name: 'geo.placename',
    content: 'Oakland',
  },
  {
    name: 'theme-color',
    content: '#0066CC', // Developer terminal light mode primary
  },
  {
    name: 'msapplication-TileColor',
    content: '#0066CC', // Developer terminal light mode primary
  },
  {
    name: 'application-name',
    content: 'Jose Conchello Portfolio',
  },

  // Canonical URL
  {
    tagName: 'link',
    rel: 'canonical',
    href: 'https://www.clyzby.com/',
  },
];

// JSON-LD Structured Data
export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Person', 'Organization'],
      '@id': 'https://www.clyzby.com/#person',
      url: 'https://www.clyzby.com/',
      name: 'Jose Conchello',
      alternateName: 'JC',
      description:
        'Full-Stack Developer and Creative Technologist specializing in React, Next.js, and immersive technology experiences.',
      email: 'jose.conchello@gmail.com',
      telephone: '314-910-3729',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Oakland',
        addressRegion: 'CA',
        addressCountry: 'US',
      },
      sameAs: [
        'https://www.linkedin.com/in/jose-conchello',
        'https://github.com/conc2304',
      ],
      image: {
        '@type': 'ImageObject',
        '@id': 'https://www.clyzby.com/#personlogo',
        url: 'https://www.clyzby.com/logo.png',
        width: 512,
        height: 512,
        caption: 'Jose Conchello Logo',
      },
      logo: {
        '@id': 'https://www.clyzby.com/#personlogo',
      },
      jobTitle: 'Full-Stack Developer & Creative Technologist',
      worksFor: {
        '@type': 'Organization',
        name: 'Freelance',
      },
      alumniOf: [
        {
          '@type': 'EducationalOrganization',
          name: 'Harvard University',
          description: 'Master of Liberal Arts, Digital Media Design',
        },
        {
          '@type': 'EducationalOrganization',
          name: 'University of Oklahoma',
          description:
            'Bachelors of Liberal Arts, French Studies & Global Enterprise',
        },
      ],
      knowsAbout: [
        'React',
        'Next.js',
        'TypeScript',
        'JavaScript',
        'Full-Stack Development',
        'Creative Technology',
        'Game Development',
        'Unity',
        'Three.js',
        'P5.js',
        'Immersive Installations',
        'UI/UX Design',
        'Enterprise Architecture',
      ],
      knowsLanguage: [
        {
          '@type': 'Language',
          name: 'English',
          alternateName: 'en',
        },
        {
          '@type': 'Language',
          name: 'Spanish',
          alternateName: 'es',
        },
        {
          '@type': 'Language',
          name: 'French',
          alternateName: 'fr',
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.clyzby.com/#website',
      url: 'https://www.clyzby.com/',
      name: 'Jose Conchello Portfolio',
      description:
        'Portfolio showcasing full-stack development, creative technology, and immersive digital experiences.',
      publisher: {
        '@id': 'https://www.clyzby.com/#person',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.clyzby.com/?s={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.clyzby.com/#webpage',
      url: 'https://www.clyzby.com/',
      name: 'Jose Conchello | Full-Stack Developer & Creative Technologist',
      isPartOf: {
        '@id': 'https://www.clyzby.com/#website',
      },
      about: {
        '@id': 'https://www.clyzby.com/#person',
      },
      description:
        'Full-Stack UI Engineer with 10+ years experience specializing in React, Next.js, and TypeScript. Expert in enterprise architectures, creative technology, game development, and immersive installations.',
      breadcrumb: {
        '@id': 'https://www.clyzby.com/#breadcrumblist',
      },
      inLanguage: 'en-US',
      potentialAction: [
        {
          '@type': 'ReadAction',
          target: 'https://www.clyzby.com/',
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://www.clyzby.com/#breadcrumblist',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'WebPage',
            '@id': 'https://www.clyzby.com/',
            url: 'https://www.clyzby.com/',
            name: 'Jose Conchello Portfolio',
          },
        },
      ],
    },
  ],
};

export const links: LinksFunction = () => [
  // Font preconnects
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },

  // Favicon links (multiple sizes for best compatibility)
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
    color: '#0066CC', // Developer terminal light mode primary
  },
];

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
        <MediaProvider provider={mediaProviderService} defaultContext="gallery">
          <EnhancedThemeProvider
            themes={enhancedThemes}
            defaultThemeId="developer-terminal"
            defaultColorMode="system"
            themeStorageKey="clyzby-app-theme"
            colorModeStorageKey="clyzby-app-color-mode"
          >
            <ThemedBgContainer />
            {children}
          </EnhancedThemeProvider>
        </MediaProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
