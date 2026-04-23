import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { createWorkspaceAliases } from './config/aliases';

const packageJsonPath = path.resolve(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as {
  version?: string;
};
const packageVersion = packageJson.version ?? '0.0.0';

export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      outDir: 'dist',
      entryRoot: 'src',
      insertTypesEntry: true,
    }),
  ],
  define: {
    __RAPIDKIT_VERSION__: JSON.stringify(packageVersion),
  },
  resolve: {
    alias: createWorkspaceAliases(__dirname),
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
});
