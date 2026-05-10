import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      '@jc/of-control-protocol': resolve(
        __dirname,
        '../../libs/shared/of-control-protocol/src/index.ts'
      ),
      '@jc/shared/of-control-client': resolve(
        __dirname,
        '../../libs/shared/of-control-client/src/index.ts'
      ),
      '@jc/fireplace-control-shared-ui': resolve(
        __dirname,
        '../../libs/shared/fireplace-control-shared-ui/src/index.ts'
      ),
      '@jc/shared/scene-controller': resolve(
        __dirname,
        '../../libs/shared/scene-controller/src/index.ts'
      ),
      '@jc/themes': resolve(__dirname, '../../libs/shared/themes/src/index.ts'),
      '@jc/shared/projection-warp': resolve(
        __dirname,
        '../../libs/shared/projection-warp/src/index.ts'
      ),
      '@jc/shared/projection-mapping-controller': resolve(
        __dirname,
        '../../libs/shared/projection-mapping-controller/src/index.ts'
      ),
      '@jc/shared/mask-capture': resolve(
        __dirname,
        '../../libs/shared/mask-capture/src/index.ts'
      ),
      '@jc/shared/mask-editor': resolve(
        __dirname,
        '../../libs/shared/mask-editor/src/index.ts'
      ),
    },
  },
  server: {
    port: 4300,
    host: '0.0.0.0',
  },
  preview: {
    port: 4300,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-mui': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
        },
      },
    },
  },
});
