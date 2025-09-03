/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import { visualizer } from 'rollup-plugin-visualizer';
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
    process.env.ANALYZE == 'true' &&
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    process.env.ANALYZE == 'true' &&
      analyzer({
        analyzerMode: 'server',
        openAnalyzer: true,
      }),
  ],
  // Uncomment this if you are using workers.
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

          // // Don't let data files pull in UI libraries
          // if (id.includes('/data/') && !id.includes('node_modules')) {
          //   return 'app-data';
          // }

          // Skip externalized modules (React, React-DOM, etc.)
          if (id.includes('node_modules')) {
            if (id.includes('@mui/')) {
              return 'vendor-mui';
            }

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
