import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts';
import fs from 'node:fs';
import path from 'path';

const staticTokenBundle: Plugin = {
  name: 'spruce-static-token-bundle',
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'tokens-static.css',
      source: fs.readFileSync(path.resolve(__dirname, 'src/tokens/tokens-static.css'), 'utf8'),
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dts({ tsconfigPath: './tsconfig.app.json', entryRoot: 'src' }), staticTokenBundle],
  build: {
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'SpruceReact',
      fileName: (format) => `spruce-react.${format}.js`
    },
    rolldownOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})
