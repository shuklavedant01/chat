import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/assets/',
  plugins: [react(), eslint()],
  server: {
    proxy: {
      // proxy all /accounts/api calls to Django
      '/accounts/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
      // add other prefixes as needed
    },
  },

  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: '@helpers',
        replacement: path.resolve(__dirname, 'src/utils/helpers'),
      },
      {
        find: '@hooks',
        replacement: path.resolve(__dirname, 'src/utils/hooks'),
      },
      {
        find: '@hocs',
        replacement: path.resolve(__dirname, 'src/utils/hocs'),
      },
    ],
  },
});
