/// <reference types='vitest' />

import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/portfolio-os-site',
  server: {
    port: 4200,
    // host: '0.0.0.0', // Changed from 'localhost'
    host: 'localhost',
  },
  preview: {
    port: 4200,
    // host: '0.0.0.0', // Changed from 'localhost'
    host: 'localhost',
  },
  plugins: [
    !process.env.VITEST && reactRouter(),
    // process.env.ANALYZE == 'true' &&
    //   visualizer({
    //     filename: 'dist/stats.html',
    //     open: true,
    //     gzipSize: true,
    //     brotliSize: true,
    //   }),
    process.env.ANALYZE == 'true' &&
      analyzer({
        analyzerMode: 'server',
        openAnalyzer: true,
      }),

    process.env.ANALYZE === 'true' &&
      analyzer({
        analyzerMode: 'json', // Outputs JSON report
        fileName: './bundle-report.json',
      }),
  ],
  // Uncomment this when using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Chunk Project data to load later
          if (id.includes('art-gallery/iOS-made-media')) {
            return 'art-gallery-data';
          }
          if (id.includes('portfolio/src/data/projects')) {
            return 'project-data';
          }

          // if (id.includes('404')) {
          //   return '404-page';
          // }

          // if (id.includes('libs/shared')) return 'shared-lib';

          // Skip externalized modules (React, React-DOM, etc.)
          if (id.includes('node_modules')) {
            // Only chunk non-externalized vendor libraries
            if (id.includes('three') || id.includes('THREE')) {
              return 'vendor-three';
            }

            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }

            if (
              id.includes('node_modules/d3-') ||
              id.includes('node_modules/d3/')
            ) {
              return 'vendor-d3';
            }

            // Return undefined for other node_modules to let Vite handle them
            return undefined;
          }
        },
      },
    },
  },
  define: {
    'import.meta.vitest': undefined,
  },
}));
